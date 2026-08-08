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
      
      if (u.searchParams.has("xrefs")) {
        const id = u.searchParams.get("xrefs");
        const xr = await db.prepare("SELECT c.*, e.word_lanes as tgt_word FROM cross_refs c JOIN entries e ON c.tgt_id = e.id WHERE c.src_id = ?").bind(id).all();
        return new Response(JSON.stringify(xr.results), { headers: { "content-type": "application/json" } });
      }

      const l = parseInt(u.searchParams.get("l") || "50");
      const o = parseInt(u.searchParams.get("o") || "0");
      const r = await db.prepare("SELECT * FROM entries ORDER BY word_lanes LIMIT ? OFFSET ?").bind(l, o).all();
      const c = await db.prepare("SELECT COUNT(*) as c FROM entries").first("c");
      return new Response(JSON.stringify({ r: r.results, c }), { headers: { "content-type": "application/json" } });
    }
    
    if (m === "POST") {
      const b = await ctx.request.json() as Record<string, any>;
      
      if (b.act === "xref_add") {
        const id = crypto.randomUUID();
        await db.prepare("INSERT INTO cross_refs (id, src_id, tgt_id, rel) VALUES (?, ?, ?, ?)")
          .bind(id, b.src_id, b.tgt_id, b.rel).run();
        return new Response(JSON.stringify({ id }), { headers: { "content-type": "application/json" } });
      }

      if (b.act === "search") {
        const p = `%${b.q}%`;
        const res = await db.prepare("SELECT id, word_lanes, word_nl FROM entries WHERE word_lanes LIKE ? LIMIT 10").bind(p).all();
        return new Response(JSON.stringify(res.results), { headers: { "content-type": "application/json" } });
      }

      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO entries (
          id, word_lanes, lemma, ipa, broad_ipa, narrow_ipa, audio_url,
          word_nl, example_sentence, pos, tone, morph, defs, colloc,
          register, entry_status, etym, additional_metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, b.wl, b.lemma, b.bipa, b.bipa, b.nipa, b.audio,
        b.wnl, b.ex, b.pos || null, b.tone,
        JSON.stringify(b.morph || null),
        JSON.stringify(b.defs || []),
        JSON.stringify(b.colloc || []),
        b.reg || 'informeel', b.sts || 'actief', b.etym, JSON.stringify(b.md || {})
      ).run();
      return new Response(JSON.stringify({ id }), { headers: { "content-type": "application/json" } });
    }
    
    if (m === "PUT") {
      const b = await ctx.request.json() as Record<string, any>;
      await db.prepare(`
        UPDATE entries SET 
          word_lanes = ?, lemma = ?, ipa = ?, broad_ipa = ?, narrow_ipa = ?, audio_url = ?,
          word_nl = ?, example_sentence = ?, pos = ?, tone = ?, morph = ?, defs = ?, colloc = ?,
          register = ?, entry_status = ?, etym = ?, additional_metadata = ?
        WHERE id = ?
      `).bind(
        b.wl, b.lemma, b.bipa, b.bipa, b.nipa, b.audio,
        b.wnl, b.ex, b.pos || null, b.tone,
        JSON.stringify(b.morph || null),
        JSON.stringify(b.defs || []),
        JSON.stringify(b.colloc || []),
        b.reg || 'informeel', b.sts || 'actief', b.etym, JSON.stringify(b.md || {}),
        b.id
      ).run();
      return new Response("{}", { headers: { "content-type": "application/json" } });
    }
    
    if (m === "DELETE") {
      const u = new URL(ctx.request.url);
      
      const xref = u.searchParams.get("xref");
      if (xref) {
        await db.prepare("DELETE FROM cross_refs WHERE id = ?").bind(xref).run();
        return new Response("{}", { headers: { "content-type": "application/json" } });
      }

      const id = u.searchParams.get("id");
      if (id) {
        await db.prepare("DELETE FROM cross_refs WHERE src_id = ? OR tgt_id = ?").bind(id, id).run();
        await db.prepare("DELETE FROM entries WHERE id = ?").bind(id).run();
      }
      return new Response("{}", { headers: { "content-type": "application/json" } });
    }
    
    return new Response("{}", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ err: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
};
