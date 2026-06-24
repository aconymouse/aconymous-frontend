import { getAllPosts, stripHtml } from "@/lib/wordpress";
import {
  ArticleCardFeatured,
  ArticleCardSecondary,
  ArticleCardList,
} from "@/components/ArticleCard";
import { StructuredData } from "@/components/StructuredData";
import Link from "next/link";

export const revalidate = 60;

const BASE_URL = "https://aconymous.com";

const profileLinks = [
  { href: "https://profiles.wordpress.org/tjuanmudaco", label: "WordPress.org" },
  { href: "https://github.com/aconymouse", label: "GitHub" },
];

// ── Section label — thin rule + uppercase label (NYT-style) ──
function SectionLabel({
  id,
  label,
  action,
  actionHref,
}: {
  id: string;
  label: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div
      className="flex items-center justify-between mb-6"
      style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "8px" }}
    >
      <h2
        id={id}
        className="text-xs uppercase tracking-widest font-semibold"
        style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text-primary)" }}
      >
        {label}
      </h2>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="text-xs transition-opacity hover:opacity-60"
          style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-geist-mono)" }}
        >
          {action}
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];

  try {
    posts = await getAllPosts(10);
  } catch (e) {
    console.error("[HomePage] Gagal fetch posts:", e);
  }

  const featured = posts[0];
  const secondary = posts.slice(1, 3);
  const latest = posts.slice(3);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Aconymous",
    url: BASE_URL,
    description:
      "Blog WordPress development, headless architecture, dan plugin development oleh Aconymous dari Indonesia.",
    author: { "@type": "Person", name: "Aconymous", url: BASE_URL },
    inLanguage: ["id", "en"],
    blogPost: posts.slice(0, 5).map((post) => ({
      "@type": "BlogPosting",
      headline: stripHtml(post.title),
      url: `${BASE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      author: { "@type": "Person", name: post.author.node.name },
    })),
  };

  return (
    <>
      <StructuredData data={blogSchema} />
      <main>
        <div className="max-w-5xl mx-auto px-4">

          {/* ── HERO ────────────────────────────────────────────── */}
          <section
            aria-labelledby="hero-heading"
            className="py-16 md:py-24"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-5"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              WordPress Developer · Open Source Contributor · Indonesia
            </p>

            <h1
              id="hero-heading"
              className="text-4xl md:text-6xl font-black leading-none mb-6 max-w-3xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Menulis tentang WordPress,{" "}
              <span style={{ color: "var(--text-secondary)" }}>
                dari dalam ekosistemnya.
              </span>
            </h1>

            <p
              className="text-base md:text-lg leading-relaxed max-w-xl mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              Aconymous adalah WordPress developer dari Indonesia. Gua nulis
              tentang headless WordPress, plugin development, dan cara
              berkontribusi ke komunitas WordPress global.
            </p>

            <nav aria-label="Profil links">
              <ul
                className="flex flex-wrap gap-3"
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                {profileLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-2 inline-block transition-opacity hover:opacity-60"
                      style={{
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-geist-mono)",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {/* ── PILIHAN EDITOR ──────────────────────────────────── */}
          {posts.length > 0 && (
            <section
              aria-labelledby="featured-heading"
              className="py-10"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <SectionLabel
                id="featured-heading"
                label="Pilihan Editor"
                action="Lihat semua →"
                actionHref="/blog"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Featured — left 2/3 */}
                {featured && (
                  <div
                    className="md:col-span-2 md:pr-8"
                    style={{ borderRight: "1px solid var(--border)" }}
                  >
                    <ArticleCardFeatured post={featured} />
                  </div>
                )}

                {/* Secondary — right 1/3 */}
                <div className="md:pl-8 flex flex-col mt-6 md:mt-0">
                  {secondary.map((post) => (
                    <ArticleCardSecondary key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── TERBARU ─────────────────────────────────────────── */}
          {latest.length > 0 && (
            <section
              aria-labelledby="latest-heading"
              className="py-10"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <SectionLabel id="latest-heading" label="Terbaru" />
              <div>
                {latest.map((post) => (
                  <ArticleCardList key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* ── AUTHOR E-E-A-T ──────────────────────────────────── */}
          <section
            aria-labelledby="author-heading"
            className="py-10"
          >
            <div className="flex items-start gap-5">
              <div
                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                aria-hidden="true"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--accent)",
                  border: "1px solid var(--border)",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                Aco
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-widest mb-2"
                  style={{
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  Tentang Penulis
                </p>
                <h2 id="author-heading" className="font-semibold mb-2">
                  Aconymous
                </h2>
                <p
                  className="text-sm leading-relaxed max-w-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  WordPress developer dari Indonesia dengan fokus pada headless
                  architecture dan plugin development. Aktif berkontribusi di
                  ekosistem WordPress global melalui WordPress.org dan komunitas
                  WPGraphQL.
                </p>
                <nav aria-label="Profil penulis" className="mt-4">
                  <ul
                    className="flex gap-4"
                    style={{ listStyle: "none", margin: 0, padding: 0 }}
                  >
                    {profileLinks.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs transition-opacity hover:opacity-60"
                          style={{
                            color: "var(--accent)",
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
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
