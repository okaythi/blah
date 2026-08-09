import { Env } from "../../types";
import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/server";

const rpName = "Dict Admin";

async function h(p: string): Promise<string> {
  const d = new TextEncoder().encode(p);
  const b = await crypto.subtle.digest("SHA-256", d);
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("");
}

function j(headers: Record<string, string>): ResponseInit {
  return { headers: { "content-type": "application/json", ...headers } };
}

function ok(data: unknown): Response {
  return new Response(JSON.stringify(data), j({}));
}

function fail(code: number, msg: string): Response {
  return new Response(JSON.stringify({ err: msg }), { status: code, ...j({}) });
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const db = ctx.env.DB;
  const req = await ctx.request.json() as Record<string, unknown>;
  const act = req.act as string;
  const u = new URL(ctx.request.url);
  const rpID = u.hostname;
  const origin = u.origin;

  try {
    if (act === "chk") {
      const c = await db.prepare("SELECT COUNT(*) as c FROM admin_users").first("c") as number;
      return ok({ c });
    }

    if (act === "reg_i") {
      const c = await db.prepare("SELECT COUNT(*) as c FROM admin_users").first("c") as number;
      if (c > 0) return fail(403, "Account already exists.");
      const id = crypto.randomUUID();
      const opts = await generateRegistrationOptions({
        rpName,
        rpID,
        userName: req.u as string,
        attestationType: "none",
        authenticatorSelection: { residentKey: "required", userVerification: "preferred" },
      });
      return ok({ opts, id });
    }

    if (act === "reg_v") {
      const v = await verifyRegistrationResponse({
        response: req.resp as Response,
        expectedChallenge: req.c as string,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });
      if (v.verified && v.registrationInfo) {
        const cred = v.registrationInfo.credential;
        const ph = await h(req.p as string);
        const uid = req.id as string;
        await db.prepare("INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)")
          .bind(uid, req.u as string, ph).run();

        const pk = Array.from(cred.publicKey);
        await db.prepare("INSERT INTO passkeys (id, user_id, public_key, sign_count) VALUES (?, ?, ?, ?)")
          .bind(cred.id, uid, JSON.stringify(pk), cred.counter).run();

        const sid = crypto.randomUUID();
        await db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
          .bind(sid, uid, Date.now() + 86400000).run();
        return ok({ sid });
      }
      return fail(400, "Registration verification failed.");
    }

    if (act === "log_i") {
      const ph = await h(req.p as string);
      const usr = await db.prepare("SELECT * FROM admin_users WHERE username = ? AND password_hash = ?")
        .bind(req.u as string, ph).first() as Record<string, unknown> | null;
      if (!usr) return fail(401, "Invalid credentials.");

      const pks = await db.prepare("SELECT * FROM passkeys WHERE user_id = ?")
        .bind(usr.id as string).all().then(x => x.results) as Record<string, unknown>[];

      const opts = await generateAuthenticationOptions({
        rpID,
        allowCredentials: pks.map(pk => ({
          id: pk.id as string,
          transports: ["internal", "hybrid"] as AuthenticatorTransportFuture[],
        })),
        userVerification: "preferred",
      });
      return ok({ opts, uid: usr.id });
    }

    if (act === "log_v") {
      const resp = req.resp as Record<string, unknown>;
      const pk = await db.prepare("SELECT * FROM passkeys WHERE id = ?")
        .bind(resp.id as string).first() as Record<string, unknown> | null;
      if (!pk) return fail(401, "Passkey not found.");

      const v = await verifyAuthenticationResponse({
        response: resp as Response,
        expectedChallenge: req.c as string,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: pk.id as string,
          publicKey: new Uint8Array(JSON.parse(pk.public_key as string)),
          counter: pk.sign_count as number,
        },
      });

      if (v.verified) {
        await db.prepare("UPDATE passkeys SET sign_count = ? WHERE id = ?")
          .bind(v.authenticationInfo.newCounter, pk.id as string).run();
        const sid = crypto.randomUUID();
        await db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
          .bind(sid, pk.user_id as string, Date.now() + 86400000).run();
        return ok({ sid });
      }
      return fail(401, "Passkey verification failed.");
    }

    return fail(400, "Unknown action.");
  } catch (err) {
    return fail(500, String(err));
  }
};
