import { getPostBySlug, getAllPostSlugs, formatDate } from "@/lib/wordpress";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        {post.categories.nodes.length > 0 && (
          <div className="flex gap-2 mb-4">
            {post.categories.nodes.map((cat) => (
              <span
                key={cat.slug}
                className="text-xs font-mono text-neutral-500 border border-neutral-800 px-2 py-1 rounded"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h1
          className="text-3xl font-bold text-white mb-4 leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />

        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <span>{post.author.node.name}</span>
          <span>·</span>
          <time>{formatDate(post.date)}</time>
        </div>
      </div>

      <div
        className="prose prose-invert prose-neutral max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-p:text-neutral-300 prose-p:leading-relaxed
          prose-a:text-white prose-a:underline
          prose-code:text-neutral-300 prose-code:bg-neutral-900 prose-code:px-1 prose-code:rounded
          prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
    </main>
  );
}