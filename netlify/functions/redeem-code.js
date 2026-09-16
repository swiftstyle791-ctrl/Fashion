import { getStore } from "@netlify/blobs";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ valid: false, reason: "bad_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const code = (body.code || "").trim().toUpperCase();
  if (!code) {
    return new Response(JSON.stringify({ valid: false, reason: "missing_code" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const store = getStore("styleswift-pro-codes");
  const record = await store.get(code, { type: "json" });

  if (!record) {
    return new Response(JSON.stringify({ valid: false, reason: "not_found" }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (record.used) {
    return new Response(JSON.stringify({ valid: false, reason: "already_used" }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  const expiresAt = Date.now() + THIRTY_DAYS_MS;
  await store.setJSON(code, {
    ...record,
    used: true,
    redeemedAt: new Date().toISOString(),
    expiresAt
  });

  return new Response(JSON.stringify({ valid: true, plan: record.plan, expiresAt }), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/redeem-code" };
