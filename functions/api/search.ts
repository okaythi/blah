import { Env } from "../types";

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const u = new URL(ctx.request.url);
  const q = u.searchParams.get("q");
  if (!q) {
    return new Response(JSON.stringify([]), {
      headers: { "content-type": "application/json" }
    });
  }
  
  const db = ctx.env.DB;
  const s = `
    SELECT e.* 
    FROM entries e
    JOIN entries_fts fts ON e.id = fts.entry_id
    WHERE entries_fts MATCH ?
    ORDER BY rank
    LIMIT 20
  `;
  const p = `"${q}"*`;
  
  try {
    const res = await db.prepare(s).bind(p).all();
    const entries = res.results as Record<string, unknown>[];

    if (entries.length > 0) {
      const ids = entries.map(e => `'${e.id}'`).join(',');
      const xr = await db.prepare(`
        SELECT c.*, e.word_lanes as tgt_word 
        FROM cross_refs c 
        JOIN entries e ON c.tgt_id = e.id 
        WHERE c.src_id IN (${ids})
      `).all();
      
      const xrefMap = new Map();
      for (const x of xr.results) {
        if (!xrefMap.has(x.src_id)) xrefMap.set(x.src_id, []);
        xrefMap.get(x.src_id).push(x);
      }

      for (const e of entries) {
        e.xrefs = xrefMap.get(e.id) || [];
      }
    }

    return new Response(JSON.stringify(entries), {
      headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ err: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
};
