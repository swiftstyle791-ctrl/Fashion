import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const sid = url.searchParams.get("sid");
  if (!sid) {
    return new Response(JSON.stringify({ error: "Missing sid" }), { status: 400 });
  }

  const store = getStore("styleswift-catalogues");

  if (req.method === "GET") {
    const data = await store.get(sid, { type: "json" });
    return new Response(JSON.stringify(data || []), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (req.method === "POST") {
    const body = await req.json();
    await store.setJSON(sid, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/catalogue" };
