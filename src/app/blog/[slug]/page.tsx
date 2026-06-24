import {
  getPostBySlug,
  getAllPostSlugs,
  getRelatedPosts,
  formatDate,
  stripHtml,
  getReadingTime,
  getCategoryColor,
  getPrimaryCategory,
} from "@/lib/wordpress";
import { StructuredData } from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Comments } from "@/components/Comments";
import { ArticleCardRelated } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Clock, User, Calendar } from "lucide-react";

export const revalidate = 60;

const BASE_URL = "https://aconymous.com";

// Typed explicitly agar tidak ada CSSProperties error
const proseVars: CSSProperties = {
  "--tw-prose-body": "#888",
  "--tw-prose-headings": "#f0f0f0",
  "--tw-prose-lead": "#999",
  "--tw-prose-links": "#f0f0f0",
  "--tw-prose-bold": "#f0f0f0",
  "--tw-prose-counters": "#555",
  "--tw-prose-bullets": "#333",
  "--tw-prose-hr": "#1c1c1c",
  "--tw-prose-quotes": "#aaa",
  "--tw-prose-quote-borders": "#c8a96e",
  "--tw-prose-captions": "#555",
  "--tw-prose-code": "#c8a96e",
  "--tw-prose-pre-code": "#d4d4d4",
  "--tw-prose-pre-bg": "#0f0f0f",
  "--tw-prose-th-borders": "#2a2a2a",
  "--tw-prose-td-borders": "#1c1c1c",
} as CSSProperties;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Artikel tidak ditemukan" };

  const title = stripHtml(post.title);
  const description = post.excerpt
    ? stripHtml(post.excerpt).slice(0, 160)
    : "";
  const ogImage =
    post.featuredImage?.node?.sourceUrl ?? `${BASE_URL}/og-default.png`;
  const url = `${BASE_URL}/blog/${post.slug}`;
  const cat = getPrimaryCategory(post);

  return {
    title,
    description,
    alternates: { canonical: url },
    category: cat?.name,
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "Aconymous",
      locale: "id_ID",
      publishedTime: post.date,
      modifiedTime: post.modified ?? post.date,
      authors: [BASE_URL],
      tags: post.tags?.nodes.map((t) => t.name) ?? [],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@aconymous",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const cat = getPrimaryCategory(post);
  const accentColor = getCategoryColor(cat?.slug ?? "");
  const readTime = post.content ? getReadingTime(post.content) : null;
  const comments = post.comments?.nodes ?? [];

  const relatedPosts = cat
    ? await getRelatedPosts(cat.slug, post.id, 4)
    : [];

  const schemaType =
    cat?.slug === "tutorial" || cat?.slug === "how-to"
      ? "TechArticle"
      : cat?.slug === "berita" || cat?.slug === "news"
      ? "NewsArticle"
      : "Article";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: stripHtml(post.title),
    description: post.excerpt
      ? stripHtml(post.excerpt).slice(0, 160)
      : "",
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.modified ?? post.date,
    author: {
      "@type": "Person",
      name: "Aconymous",
      url: BASE_URL,
      sameAs: [
        "https://github.com/aconymouse",
        "https://profiles.wordpress.org/tjuanmudaco",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Aconymous",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    inLanguage: "id",
    image: post.featuredImage?.node
      ? {
          "@type": "ImageObject",
          url: post.featuredImage.node.sourceUrl,
          width: post.featuredImage.node.mediaDetails?.width ?? 1200,
          height: post.featuredImage.node.mediaDetails?.height ?? 630,
        }
      : undefined,
    keywords: post.tags?.nodes.map((t) => t.name).join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
    commentCount: comments.length,
  };

  const authorLinks = [
    {
      href: "https://profiles.wordpress.org/tjuanmudaco",
      label: "WordPress.org",
    },
    { href: "https://github.com/aconymouse", label: "GitHub" },
  ];

  return (
    <>
      <StructuredData data={articleSchema} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Aconymous", href: "/" },
              { label: "Artikel", href: "/blog" },
              ...(cat
                ? [
                    {
                      label: cat.name,
                      href: `/blog?kategori=${cat.slug}`,
                    },
                  ]
                : []),
              { label: stripHtml(post.title) },
            ]}
          />
        </div>

        {/* Layout artikel + sidebar */}
        <div className="flex gap-10 items-start">

          {/* Main content */}
          <main className="flex-1 min-w-0 max-w-2xl mx-auto">
            <article>

              {/* Header */}
              <header className="mb-10">
                {cat && (
                  <span
                    className="text-xs uppercase tracking-widest mb-4 block"
                    style={{
                      color: accentColor,
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    {cat.name}
                  </span>
                )}

                <h1
                  className="text-3xl md:text-4xl font-semibold leading-tight mb-6"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />

                <div
                  className="flex flex-wrap items-center gap-4 pb-6 text-xs"
                  style={{
                    borderBottom: "1px solid #1c1c1c",
                    color: "#555",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  <address
                    rel="author"
                    className="not-italic flex items-center gap-1"
                  >
                    <User size={11} aria-hidden="true" />
                    {post.author.node.name}
                  </address>

                  <time
                    dateTime={post.date}
                    className="flex items-center gap-1"
                  >
                    <Calendar size={11} aria-hidden="true" />
                    {formatDate(post.date)}
                  </time>

                  {post.modified && post.modified !== post.date && (
                    <span style={{ color: "#444" }}>
                      Diperbarui {formatDate(post.modified)}
                    </span>
                  )}

                  {readTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} aria-hidden="true" />
                      {readTime} menit baca
                    </span>
                  )}
                </div>
              </header>

              {/* Article Content */}
              <div
                className="prose prose-invert prose-neutral max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-white prose-a:underline prose-pre:rounded-none"
                style={proseVars}
                dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
              />

              {/* Ad slot */}
              <div className="my-10">
                <AdSlot id="ad-in-article" size="banner" />
              </div>

              {/* Tags */}
              {post.tags && post.tags.nodes.length > 0 && (
                <footer
                  className="mt-10 pt-8"
                  style={{ borderTop: "1px solid #1c1c1c" }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-3"
                    style={{
                      color: "#333",
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    Tags
                  </p>
                  <ul
                    className="flex flex-wrap gap-2"
                    style={{ listStyle: "none", margin: 0, padding: 0 }}
                  >
                    {post.tags.nodes.map((tag) => (
                      <li key={tag.slug}>
                        <a
                          href={`/blog?tag=${tag.slug}`}
                          className="text-xs px-2 py-1 transition-colors hover:border-neutral-600"
                          style={{
                            border: "1px solid #1c1c1c",
                            color: "#555",
                            fontFamily: "var(--font-geist-mono)",
                          }}
                        >
                          {tag.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </footer>
              )}

              {/* Author bio E-E-A-T */}
              <div
                className="mt-10 p-5"
                style={{
                  backgroundColor: "#0f0f0f",
                  border: "1px solid #1c1c1c",
                  borderLeft: "3px solid #c8a96e",
                }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{
                    color: "#333",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  Tentang Penulis
                </p>
                <h2 className="font-semibold mb-2 text-base">Aconymous</h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#555" }}
                >
                  WordPress developer dari Indonesia dengan fokus pada headless
                  architecture dan plugin development. Aktif berkontribusi di
                  WordPress.org dan komunitas WPGraphQL.
                </p>
                <nav aria-label="Profil penulis" className="mt-3">
                  <ul
                    className="flex gap-4"
                    style={{ listStyle: "none", margin: 0, padding: 0 }}
                  >
                    {authorLinks.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs hover:opacity-75 transition-opacity"
                          style={{
                            color: "#c8a96e",
                            fontFamily: "var(--font-geist-mono)",
                          }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Comments */}
              <div className="mt-10">
                <Comments
                  comments={comments}
                  postId={post.databaseId}
                />
              </div>

            </article>
          </main>

          {/* Sidebar */}
          <aside
            className="hidden lg:block shrink-0"
            style={{ width: "280px" }}
            aria-label="Sidebar"
          >
            <div
              style={{
                position: "sticky",
                top: "80px",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <section aria-labelledby="related-heading">
                  <h2
                    id="related-heading"
                    className="text-xs uppercase tracking-widest mb-4"
                    style={{
                      color: "#333",
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    Artikel Terkait
                  </h2>
                  <div>
                    {relatedPosts.map((related) => (
                      <ArticleCardRelated key={related.id} post={related} />
                    ))}
                  </div>
                </section>
              )}

              {/* Ad sidebar */}
              <div>
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{
                    color: "#2a2a2a",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  Advertisement
                </p>
                <AdSlot id="ad-sidebar" size="rectangle" />
              </div>

              {/* Tags sidebar */}
              {post.tags && post.tags.nodes.length > 0 && (
                <section aria-labelledby="tags-sidebar-heading">
                  <h2
                    id="tags-sidebar-heading"
                    className="text-xs uppercase tracking-widest mb-3"
                    style={{
                      color: "#333",
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    Tags
                  </h2>
                  <ul
                    className="flex flex-wrap gap-2"
                    style={{ listStyle: "none", margin: 0, padding: 0 }}
                  >
                    {post.tags.nodes.map((tag) => (
                      <li key={tag.slug}>
                        <a
                          href={`/blog?tag=${tag.slug}`}
                          className="text-xs px-2 py-1 transition-colors hover:border-neutral-700"
                          style={{
                            border: "1px solid #1a1a1a",
                            color: "#444",
                            fontFamily: "var(--font-geist-mono)",
                          }}
                        >
                          {tag.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
