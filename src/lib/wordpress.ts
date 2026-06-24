// ============================================================
// WordPress Helpers — Data fetching, types, utils
// Kalau ada yang error di sini, cek dulu WPGraphQL-nya aktif
// dan Public Introspection-nya di-enable. Gua pernah lupa itu.
// ============================================================

import { fetchGraphQL } from "./graphql";
import {
  GET_ALL_POSTS,
  GET_POST_BY_SLUG,
  GET_ALL_POST_SLUGS,
  GET_RELATED_POSTS,
} from "./queries";

// ── Types ────────────────────────────────────────────────────

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
    mediaDetails?: { width: number; height: number };
  };
}

export interface Category {
  name: string;
  slug: string;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Author {
  name: string;
  slug: string;
  description?: string;
  avatar?: { url: string };
}

export interface Comment {
  id: string;
  date: string;
  content: string;
  parentId: string | null;
  author: {
    node: {
      name: string;
      avatar?: { url: string };
    };
  };
}

export interface Post {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date: string;
  modified?: string;
  featuredImage?: FeaturedImage;
  categories: { nodes: Category[] };
  tags?: { nodes: Tag[] };
  author: { node: Author };
  comments?: { nodes: Comment[] };
}

// ── Fetch functions ──────────────────────────────────────────

export async function getAllPosts(first = 10): Promise<Post[]> {
  const data = await fetchGraphQL<{ posts: { nodes: Post[] } }>(
    GET_ALL_POSTS,
    { first }
  );
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

export async function getRelatedPosts(
  categorySlug: string,
  excludeId: string,
  first = 4
): Promise<Post[]> {
  try {
    const data = await fetchGraphQL<{ posts: { nodes: Post[] } }>(
      GET_RELATED_POSTS,
      { categorySlug, excludeId, first }
    );
    return data.posts.nodes;
  } catch {
    // Related posts gagal? Gapapa, hidup tetap jalan.
    return [];
  }
}

// ── Utils ────────────────────────────────────────────────────

export function formatDate(dateString: string, short = false): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: short ? "short" : "long",
    year: "numeric",
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

// Estimasi waktu baca — 200 kata/menit is the standard
// (asumsi pembaca yang fokus, bukan sambil scroll TikTok)
export function getReadingTime(content: string): number {
  const wordCount = stripHtml(content).trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Warna per kategori — signature element kita
// Left border yang ngasih visual taxonomy langsung ke pembaca
export function getCategoryColor(slug: string): string {
  const palette: Record<string, string> = {
    tutorial: "#3b82f6",    // blue — learning mode
    "how-to": "#3b82f6",
    opini: "#f59e0b",       // amber — hot take incoming
    opinion: "#f59e0b",
    berita: "#ef4444",      // red — breaking!
    news: "#ef4444",
    review: "#8b5cf6",      // purple — verdict time
    plugin: "#10b981",      // green — open source vibes
    wordpress: "#10b981",
  };
  return palette[slug] ?? "#c8a96e"; // default: gold accent
}

export function getPrimaryCategory(post: Post): Category | null {
  return post.categories.nodes[0] ?? null;
}