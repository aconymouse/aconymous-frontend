// ============================================================
// GraphQL Fetcher — Native fetch, no Apollo, no drama
// Ini yang jadi jembatan antara Next.js dan WPGraphQL kita.
// Keep it simple, keep it fast.
// ============================================================

const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL!;

if (!GRAPHQL_URL) {
  // Kalau ini error-nya, berarti .env.local lo belum diisi.
  // Jangan tanya ke Stack Overflow dulu, cek itu file dulu.
  throw new Error("NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL is not defined");
}

export async function fetchGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 60
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate }, // ISR built-in Next.js — no extra config needed
  });

  if (!res.ok) {
    throw new Error(`GraphQL fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}