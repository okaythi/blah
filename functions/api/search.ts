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
    return new Response(JSON.stringify(res.results), {
      headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ err: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
};
