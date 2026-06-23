const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL!;

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
    next: { revalidate }, // ISR bawaan Next.js
  });

  if (!res.ok) {
    throw new Error(`GraphQL fetch gagal: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}