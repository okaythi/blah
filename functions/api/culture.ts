import type { Env } from "../../types";

export const onRequestGet = async (context: EventContext<Env, string, unknown>) => {
  try {
    const facts = await context.env.DB.prepare(
      `SELECT * FROM culture_facts ORDER BY created_at DESC`
    ).all();

    const images = await context.env.DB.prepare(
      `SELECT * FROM culture_images ORDER BY created_at DESC`
    ).all();

    return new Response(
      JSON.stringify({
        facts: facts.results || [],
        images: images.results || []
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (e: unknown) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Fout opgetreden bij ophalen van cultuur." }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
};
