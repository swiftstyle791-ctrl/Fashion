import { getStore } from "@netlify/blobs";

const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomSegment(length) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return out;
}

function generateCode() {
  return `SS-${randomSegment(4)}-${randomSegment(4)}`;
}

export default async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const adminKey = process.env.STYLESWIFT_ADMIN_KEY;

  if (!adminKey) {
    return new Response(
      JSON.stringify({ error: "Server not configured: STYLESWIFT_ADMIN_KEY missing" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!key || key !== adminKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const store = getStore("styleswift-pro-codes");

  let code;
  do {
    code = generateCode();
  } while (await store.get(code));

  await store.setJSON(code, {
    plan: "pro",
    used: false,
    createdAt: new Date().toISOString()
  });

  return new Response(JSON.stringify({ code }), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/generate-code" };
