import type { Env } from "../types";

export const onRequestGet = async (context: EventContext<Env, string, unknown>) => {
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT COUNT(*) as count FROM entries WHERE entry_status = 'actief' OR entry_status = 'archaïsch'`
    ).all();

    const count = results?.[0]?.count || 0;

    return new Response(JSON.stringify({ count }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: "Fout" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
