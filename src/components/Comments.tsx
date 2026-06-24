"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Comment, formatDate } from "@/lib/wordpress";

interface CommentsProps {
  comments: Comment[];
  postId: number;
}

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export function Comments({ comments, postId }: CommentsProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${WP_URL}/wp-json/wp/v2/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: postId,
          author_name: name,
          author_email: email,
          content,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setContent("");
      } else {
        const data = await res.json();
        setErrorMsg(data.message ?? "Gagal mengirim komentar.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Koneksi bermasalah. Coba lagi ya.");
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#0a0a0a",
    border: "1px solid #2a2a2a",
    color: "#f0f0f0",
    width: "100%",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <section
      aria-labelledby="comments-heading"
      style={{ borderTop: "1px solid #1c1c1c", paddingTop: "3rem" }}
    >
      <h2
        id="comments-heading"
        className="flex items-center gap-2 text-sm font-semibold mb-8"
        style={{ color: "#f0f0f0" }}
      >
        <MessageSquare size={14} aria-hidden="true" style={{ color: "#555" }} />
        {comments.length > 0
          ? `${comments.length} Komentar`
          : "Jadilah yang pertama berkomentar"}
      </h2>

      {comments.length > 0 && (
        <div className="mb-10 space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} id={`comment-${comment.id}`} className="flex gap-4">
              <div
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                aria-hidden="true"
                style={{
                  backgroundColor: "#1a1a1a",
                  color: "#c8a96e",
                  border: "1px solid #2a2a2a",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                {comment.author.node.name[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm font-semibold" style={{ color: "#f0f0f0" }}>
                    {comment.author.node.name}
                  </span>
                  <time
                    className="text-xs"
                    dateTime={comment.date}
                    style={{ color: "#444", fontFamily: "var(--font-geist-mono)" }}
                  >
                    {formatDate(comment.date)}
                  </time>
                </div>
                <div
                  className="text-sm leading-relaxed"
                  style={{ color: "#888" }}
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          backgroundColor: "#0f0f0f",
          border: "1px solid #1c1c1c",
          borderLeft: "3px solid #c8a96e",
          padding: "1.5rem",
        }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#f0f0f0" }}>
          Tinggalkan Komentar
        </h3>

        {status === "success" ? (
          <p className="text-sm py-4" role="alert" style={{ color: "#4ade80" }}>
            Komentar terkirim! Menunggu moderasi sebelum tampil.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="comment-name"
                  className="block text-xs mb-1"
                  style={{ color: "#555", fontFamily: "var(--font-geist-mono)" }}
                >
                  Nama *
                </label>
                <input
                  id="comment-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  htmlFor="comment-email"
                  className="block text-xs mb-1"
                  style={{ color: "#555", fontFamily: "var(--font-geist-mono)" }}
                >
                  Email * (tidak dipublish)
                </label>
                <input
                  id="comment-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="comment-content"
                className="block text-xs mb-1"
                style={{ color: "#555", fontFamily: "var(--font-geist-mono)" }}
              >
                Komentar *
              </label>
              <textarea
                id="comment-content"
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {status === "error" && errorMsg && (
              <p className="text-xs mb-4" role="alert" style={{ color: "#ef4444" }}>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 text-xs px-4 py-2 transition-all"
              style={{
                backgroundColor: status === "loading" ? "#1a1a1a" : "#c8a96e",
                color: status === "loading" ? "#555" : "#0a0a0a",
                fontFamily: "var(--font-geist-mono)",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              <Send size={12} aria-hidden="true" />
              {status === "loading" ? "Mengirim..." : "Kirim Komentar"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}