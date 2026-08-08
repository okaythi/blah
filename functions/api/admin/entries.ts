import { Env } from "../../types";

const ck = async (db: D1Database, req: Request) => {
  const h = req.headers.get("Authorization");
  if (!h || !h.startsWith("Bearer ")) return false;
  const sid = h.split(" ")[1];
  const s: any = await db.prepare("SELECT * FROM sessions WHERE id = ?").bind(sid).first();
  if (!s || s.expires_at < Date.now()) return false;
  return true;
};

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const db = ctx.env.DB;
  if (!(await ck(db, ctx.request))) return new Response("{}", { status: 401 });
  
  const m = ctx.request.method;
  
  try {
    if (m === "GET") {
      const u = new URL(ctx.request.url);
      const l = parseInt(u.searchParams.get("l") || "50");
      const o = parseInt(u.searchParams.get("o") || "0");
      const r = await db.prepare("SELECT * FROM entries ORDER BY word_lanes LIMIT ? OFFSET ?").bind(l, o).all();
      const c = await db.prepare("SELECT COUNT(*) as c FROM entries").first("c");
      return new Response(JSON.stringify({ r: r.results, c }), { headers: { "content-type": "application/json" } });
    }
    
    if (m === "POST") {
      const b = await ctx.request.json() as any;
      if (b.act === "batch") {
        const sm = db.prepare("INSERT INTO entries (id, word_lanes, ipa, word_nl, example_sentence, additional_metadata) VALUES (?, ?, ?, ?, ?, ?)");
        const bs = b.r.map((x: any) => sm.bind(crypto.randomUUID(), x.wl, x.ipa, x.wnl, x.ex, JSON.stringify(x.md || {})));
        await db.batch(bs);
        return new Response("{}", { headers: { "content-type": "application/json" } });
      } else {
        const id = crypto.randomUUID();
        await db.prepare("INSERT INTO entries (id, word_lanes, ipa, word_nl, example_sentence, additional_metadata) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(id, b.wl, b.ipa, b.wnl, b.ex, JSON.stringify(b.md || {})).run();
        return new Response(JSON.stringify({ id }), { headers: { "content-type": "application/json" } });
      }
    }
    
    if (m === "PUT") {
      const b = await ctx.request.json() as any;
      await db.prepare("UPDATE entries SET word_lanes = ?, ipa = ?, word_nl = ?, example_sentence = ?, additional_metadata = ? WHERE id = ?")
        .bind(b.wl, b.ipa, b.wnl, b.ex, JSON.stringify(b.md || {}), b.id).run();
      return new Response("{}", { headers: { "content-type": "application/json" } });
    }
    
    if (m === "DELETE") {
      const u = new URL(ctx.request.url);
      const id = u.searchParams.get("id");
      if (id) {
        await db.prepare("DELETE FROM entries WHERE id = ?").bind(id).run();
      }
      return new Response("{}", { headers: { "content-type": "application/json" } });
    }
    
    return new Response("{}", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ err: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
};
