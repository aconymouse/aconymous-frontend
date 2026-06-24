// ============================================================
// ArticleCard — 4 variant: Featured, Secondary, List, Related
// Signature element: left border color per kategori.
// Blue = tutorial · Amber = opini · Red = berita · Gold = default
// ============================================================

import Link from "next/link";
import { Clock } from "lucide-react";
import {
  Post,
  formatDate,
  stripHtml,
  getReadingTime,
  getCategoryColor,
  getPrimaryCategory,
} from "@/lib/wordpress";

// ── Featured Card ─────────────────────────────────────────────
// Artikel utama — besar, editorial, dominan di grid

export function ArticleCardFeatured({ post }: { post: Post }) {
  const cat = getPrimaryCategory(post);
  const accentColor = getCategoryColor(cat?.slug ?? "");
  const readTime = post.content ? getReadingTime(post.content) : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article
        className="h-full transition-colors duration-150"
        style={{
          borderLeft: `3px solid ${accentColor}`,
          paddingLeft: "1.25rem",
        }}
        aria-label={`Baca artikel: ${stripHtml(post.title)}`}
      >
        {cat && (
          <span
            className="text-xs uppercase tracking-widest mb-2 block"
            style={{
              color: accentColor,
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {cat.name}
          </span>
        )}

        <h3
          className="text-xl font-bold leading-snug mb-3 transition-opacity duration-150 group-hover:opacity-60"
          style={{ letterSpacing: "-0.02em" }}
          dangerouslySetInnerHTML={{ __html: post.title }}
        />

        {post.excerpt && (
          <p
            className="text-sm leading-relaxed mb-4 line-clamp-3"
            style={{ color: "var(--text-secondary)" }}
          >
            {stripHtml(post.excerpt)}
          </p>
        )}

        <footer
          className="flex items-center gap-3 text-xs"
          style={{
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          <time dateTime={post.date}>{formatDate(post.date, true)}</time>
          {readTime && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock size={10} aria-hidden="true" />
                {readTime} mnt baca
              </span>
            </>
          )}
        </footer>
      </article>
    </Link>
  );
}

// ── Secondary Card ────────────────────────────────────────────
// Artikel pendukung — compact, sidebar grid

export function ArticleCardSecondary({ post }: { post: Post }) {
  const cat = getPrimaryCategory(post);
  const accentColor = getCategoryColor(cat?.slug ?? "");

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className="py-4 transition-opacity duration-150 group-hover:opacity-60"
        style={{
          borderLeft: `3px solid ${accentColor}`,
          paddingLeft: "1rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}
        aria-label={`Baca artikel: ${stripHtml(post.title)}`}
      >
        {cat && (
          <span
            className="text-xs uppercase tracking-widest mb-1 block"
            style={{
              color: accentColor,
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {cat.name}
          </span>
        )}

        <h3
          className="text-sm font-semibold leading-snug mb-2"
          style={{ letterSpacing: "-0.01em" }}
          dangerouslySetInnerHTML={{ __html: post.title }}
        />

        <time
          className="text-xs"
          dateTime={post.date}
          style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-geist-mono)" }}
        >
          {formatDate(post.date, true)}
        </time>
      </article>
    </Link>
  );
}

// ── List Card ─────────────────────────────────────────────────
// Artikel terbaru — row dengan divider, compact Medium-style

export function ArticleCardList({ post }: { post: Post }) {
  const cat = getPrimaryCategory(post);
  const accentColor = getCategoryColor(cat?.slug ?? "");
  const readTime = post.content ? getReadingTime(post.content) : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className="py-5 flex items-start justify-between gap-6"
        style={{ borderBottom: "1px solid var(--border)" }}
        aria-label={`Baca artikel: ${stripHtml(post.title)}`}
      >
        <div className="flex-1 min-w-0">
          {cat && (
            <span
              className="text-xs uppercase tracking-widest mb-1 block"
              style={{
                color: accentColor,
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              {cat.name}
            </span>
          )}

          <h3
            className="font-semibold leading-snug mb-1 transition-opacity duration-150 group-hover:opacity-50"
            style={{ letterSpacing: "-0.01em" }}
            dangerouslySetInnerHTML={{ __html: post.title }}
          />

          {post.excerpt && (
            <p
              className="text-sm line-clamp-1 mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {stripHtml(post.excerpt)}
            </p>
          )}
        </div>

        <div
          className="text-xs shrink-0 flex flex-col items-end gap-1"
          style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-geist-mono)" }}
        >
          <time dateTime={post.date}>{formatDate(post.date, true)}</time>
          {readTime && <span>{readTime} mnt</span>}
        </div>
      </article>
    </Link>
  );
}

// ── Related Card ─────────────────────────────────────────────
// Sidebar artikel terkait — minimal

export function ArticleCardRelated({ post }: { post: Post }) {
  const cat = getPrimaryCategory(post);
  const accentColor = getCategoryColor(cat?.slug ?? "");

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className="py-3 transition-opacity duration-150 group-hover:opacity-60"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        {cat && (
          <span
            className="text-xs uppercase tracking-widest mb-1 block"
            style={{
              color: accentColor,
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {cat.name}
          </span>
        )}
        <h4
          className="text-sm font-medium leading-snug"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <time
          className="text-xs mt-1 block"
          dateTime={post.date}
          style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-geist-mono)" }}
        >
          {formatDate(post.date, true)}
        </time>
      </article>
    </Link>
  );
}
