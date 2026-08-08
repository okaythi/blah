import { Env } from "../../types";
import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";

const rpName = "Dict Admin";

async function h(p: string) {
  const d = new TextEncoder().encode(p);
  const b = await crypto.subtle.digest('SHA-256', d);
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const db = ctx.env.DB;
  const req = await ctx.request.json() as any;
  const act = req.act;
  const u = new URL(ctx.request.url);
  const rpID = u.hostname;
  const origin = u.origin;

  try {
    if (act === "chk") {
      const c = await db.prepare("SELECT COUNT(*) as c FROM admin_users").first("c") as number;
      return new Response(JSON.stringify({ c }), { headers: { "content-type": "application/json" } });
    }

    if (act === "reg_i") {
      const c = await db.prepare("SELECT COUNT(*) as c FROM admin_users").first("c") as number;
      if (c > 0) return new Response("{}", { status: 403 });
      const id = crypto.randomUUID();
      const opts = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: new TextEncoder().encode(id),
        userName: req.u,
        attestationType: 'none',
        authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' },
      });
      return new Response(JSON.stringify({ opts, id }), { headers: { "content-type": "application/json" } });
    }

    if (act === "reg_v") {
      const v = await verifyRegistrationResponse({
        response: req.resp,
        expectedChallenge: req.c,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });
      if (v.verified && v.registrationInfo) {
        const ph = await h(req.p);
        await db.prepare("INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)")
          .bind(req.id, req.u, ph).run();
        
        const k = Array.from(v.registrationInfo.credentialPublicKey);
        await db.prepare("INSERT INTO passkeys (id, user_id, public_key, sign_count) VALUES (?, ?, ?, ?)")
          .bind(v.registrationInfo.credentialID, req.id, JSON.stringify(k), v.registrationInfo.counter).run();
        
        const sid = crypto.randomUUID();
        await db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
          .bind(sid, req.id, Date.now() + 86400000).run();
        return new Response(JSON.stringify({ sid }), { headers: { "content-type": "application/json" } });
      }
      return new Response("{}", { status: 400 });
    }

    if (act === "log_i") {
      const ph = await h(req.p);
      const usr: any = await db.prepare("SELECT * FROM admin_users WHERE username = ? AND password_hash = ?")
        .bind(req.u, ph).first();
      if (!usr) return new Response("{}", { status: 401 });

      const pks: any[] = await db.prepare("SELECT * FROM passkeys WHERE user_id = ?").bind(usr.id).all().then(x => x.results);
      const opts = await generateAuthenticationOptions({
        rpID,
        allowCredentials: pks.map(pk => ({
          id: pk.id,
          type: 'public-key',
        })),
        userVerification: 'preferred',
      });
      return new Response(JSON.stringify({ opts, uid: usr.id }), { headers: { "content-type": "application/json" } });
    }

    if (act === "log_v") {
      const pk: any = await db.prepare("SELECT * FROM passkeys WHERE id = ?").bind(req.resp.id).first();
      if (!pk) return new Response("{}", { status: 401 });
      
      const v = await verifyAuthenticationResponse({
        response: req.resp,
        expectedChallenge: req.c,
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator: {
          credentialID: pk.id,
          credentialPublicKey: new Uint8Array(JSON.parse(pk.public_key)),
          counter: pk.sign_count,
        },
      });

      if (v.verified) {
        await db.prepare("UPDATE passkeys SET sign_count = ? WHERE id = ?").bind(v.authenticationInfo.newCounter, pk.id).run();
        const sid = crypto.randomUUID();
        await db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
          .bind(sid, pk.user_id, Date.now() + 86400000).run();
        return new Response(JSON.stringify({ sid }), { headers: { "content-type": "application/json" } });
      }
      return new Response("{}", { status: 401 });
    }

    return new Response("{}", { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ err: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
};
