import type { Env, D1Database } from "../../../types";

const ck = async (db: D1Database, req: Request) => {
  const h = req.headers.get("Authorization");
  if (!h || !h.startsWith("Bearer ")) return false;
  const sid = h.split(" ")[1];
  const s = await db.prepare("SELECT * FROM sessions WHERE id = ?").bind(sid).first<Record<string, unknown>>();
  if (!s || s.expires_at < Date.now()) return false;
  return true;
};

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const db = ctx.env.DB;
  if (!(await ck(db, ctx.request))) return new Response("{}", { status: 401 });
  
  const m = ctx.request.method;
  
  try {
    if (m === "POST") {
      const b = await ctx.request.json() as Record<string, unknown>;
      const id = crypto.randomUUID();
      const ts = Date.now();
      
      if (b.type === "fact") {
        await db.prepare("INSERT INTO culture_facts (id, fact, created_at) VALUES (?, ?, ?)")
          .bind(id, b.fact, ts).run();
        return new Response(JSON.stringify({ id }), { headers: { "content-type": "application/json" } });
      } else if (b.type === "image") {
        await db.prepare("INSERT INTO culture_images (id, image_url, caption, created_at) VALUES (?, ?, ?, ?)")
          .bind(id, b.image_url, b.caption || null, ts).run();
        return new Response(JSON.stringify({ id }), { headers: { "content-type": "application/json" } });
      }
      return new Response("{}", { status: 400 });
    }
    
    if (m === "PUT") {
      const b = await ctx.request.json() as Record<string, unknown>;
      
      if (b.type === "fact") {
        await db.prepare("UPDATE culture_facts SET fact = ? WHERE id = ?")
          .bind(b.fact, b.id).run();
        return new Response("{}", { headers: { "content-type": "application/json" } });
      } else if (b.type === "image") {
        await db.prepare("UPDATE culture_images SET image_url = ?, caption = ? WHERE id = ?")
          .bind(b.image_url, b.caption || null, b.id).run();
        return new Response("{}", { headers: { "content-type": "application/json" } });
      }
      return new Response("{}", { status: 400 });
    }
    
    if (m === "DELETE") {
      const u = new URL(ctx.request.url);
      const id = u.searchParams.get("id");
      const type = u.searchParams.get("type");
      
      if (id && type === "fact") {
        await db.prepare("DELETE FROM culture_facts WHERE id = ?").bind(id).run();
      } else if (id && type === "image") {
        await db.prepare("DELETE FROM culture_images WHERE id = ?").bind(id).run();
      }
      return new Response("{}", { headers: { "content-type": "application/json" } });
    }
    
    return new Response("{}", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ err: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
  }
};
