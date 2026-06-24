import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const GeistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const GeistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
import { Nav } from "@/components/Nav";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

const BASE_URL = "https://aconymous.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Aconymous - WordPress Developer & Contributor",
    template: "%s | Aconymous",
  },
  description:
    "Blog tentang WordPress development, headless architecture, dan plugin development. Oleh Aconymous, WordPress developer dari Indonesia.",
  authors: [{ name: "Aconymous", url: BASE_URL }],
  creator: "Aconymous",
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    siteName: "Aconymous",
    url: BASE_URL,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Aconymous - WordPress Developer & Contributor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@aconymous",
    site: "@aconymous",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: BASE_URL },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Aconymous",
  url: BASE_URL,
  description:
    "Blog WordPress development, headless architecture, dan plugin development.",
  inLanguage: ["id", "en"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aconymous",
  url: BASE_URL,
  jobTitle: "WordPress Developer & Open Source Contributor",
  knowsAbout: [
    "WordPress",
    "WPGraphQL",
    "Next.js",
    "PHP",
    "Headless CMS",
    "Plugin Development",
    "Open Source",
  ],
  sameAs: [
    "https://github.com/aconymouse",
    "https://profiles.wordpress.org/tjuanmudaco",
  ],
  nationality: { "@type": "Country", name: "Indonesia" },
};

const footerLinks = [
  { href: "https://github.com/aconymouse", label: "GitHub" },
  { href: "https://profiles.wordpress.org/tjuanmudaco", label: "WordPress.org" },
];

// Prevent Flash of Unstyled Theme (FOUC)
const themeScript = `
  try {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        {/* Run before paint — prevents theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Langsung ke konten utama
        </a>

        <StructuredData data={websiteSchema} />
        <StructuredData data={personSchema} />

        <Nav />

        <div id="main-content">{children}</div>

        <footer
          role="contentinfo"
          style={{
            borderTop: "1px solid var(--border)",
            marginTop: "80px",
          }}
        >
          <div
            className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <span
              className="text-xs uppercase tracking-widest"
              style={{
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              2026 Aconymous — Built with WordPress + Next.js
            </span>
            <nav aria-label="Footer navigation">
              <ul
                className="flex gap-6"
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs transition-opacity hover:opacity-60"
                      style={{
                        color: "var(--text-tertiary)",
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
        </footer>
      </body>
    </html>
  );
}
