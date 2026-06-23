import { getAllPosts, formatDate, stripHtml } from "@/lib/wordpress";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];

  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error("Gagal fetch posts:", error);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <section className="mb-20">
        <p className="text-sm text-neutral-500 mb-3 font-mono">@aconymous</p>
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          WordPress Developer & <br />
          Open Source Contributor
        </h1>
        <p className="text-neutral-400 text-lg leading-relaxed max-w-xl">
          Gua nulis tentang WordPress, headless architecture, dan plugin
          development. Dari Indonesia, buat komunitas global.
        </p>
      </section>

      <section>
        <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-6">
          Artikel Terbaru
        </h2>

        {posts.length === 0 ? (
          <div className="text-neutral-600 py-12 text-center">
            <p>Belum ada artikel. Buat post pertama di WordPress!</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {posts.map((post) => (
              <article key={post.id} className="py-6 group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className="text-white font-medium mb-1 group-hover:text-neutral-300 transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />
                      {post.excerpt && (
                        <p className="text-neutral-500 text-sm line-clamp-1">
                          {stripHtml(post.excerpt)}
                        </p>
                      )}
                    </div>
                    <time className="text-neutral-600 text-sm whitespace-nowrap font-mono">
                      {formatDate(post.date)}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}