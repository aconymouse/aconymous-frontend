import { fetchGraphQL } from "./graphql";
import { GET_ALL_POSTS, GET_POST_BY_SLUG, GET_ALL_POST_SLUGS } from "./queries";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories: { nodes: { name: string; slug: string }[] };
  author: { node: { name: string } };
}

export async function getAllPosts(): Promise<Post[]> {
  const data = await fetchGraphQL<{ posts: { nodes: Post[] } }>(GET_ALL_POSTS);
  return data.posts.nodes;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await fetchGraphQL<{ postBy: Post | null }>(
    GET_POST_BY_SLUG,
    { slug }
  );
  return data.postBy;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const data = await fetchGraphQL<{ posts: { nodes: { slug: string }[] } }>(
    GET_ALL_POST_SLUGS
  );
  return data.posts.nodes.map((p) => p.slug);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "").trim();
}