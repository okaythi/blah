import type { Env } from "../types";

export const onRequestGet = async (context: EventContext<Env, any, any>) => {
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT * FROM entries WHERE entry_status = 'actief' OR entry_status = 'archaïsch' ORDER BY LOWER(word_lanes) ASC`
    ).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify([]), { headers: { "content-type": "application/json" } });
    }

    const ids = results.map(r => `'${r.id}'`).join(',');
    const crRes = await context.env.DB.prepare(
      `SELECT c.id, c.src_id, c.tgt_id, c.rel, e.word_lanes as tgt_word 
       FROM cross_refs c 
       JOIN entries e ON c.tgt_id = e.id 
       WHERE c.src_id IN (${ids})`
    ).all();
    const crList = crRes.results || [];

    const final = results.map((r: any) => {
      const xr = crList.filter((c: any) => c.src_id === r.id);
      return { ...r, xrefs: xr };
    });

    return new Response(JSON.stringify(final), {
      headers: { "content-type": "application/json" },
    });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Fout opgetreden bij ophalen van het register." }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
