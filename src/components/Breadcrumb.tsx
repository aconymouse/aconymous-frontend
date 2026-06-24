// ============================================================
// Breadcrumb — Navigasi hierarki halaman
// Penting buat: UX, SEO, E-E-A-T, dan biar user tau mereka ada di mana.
// Google loves this. Bing loves this. Bahkan DuckDuckGo loves this.
// ============================================================

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StructuredData } from "./StructuredData";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const BASE_URL = "https://aconymous.com";

export function Breadcrumb({ items }: BreadcrumbProps) {
  // Schema.org BreadcrumbList untuk rich results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${BASE_URL}${item.href}` : undefined,
    })),
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <nav
        aria-label="Breadcrumb"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        <ol
          className="flex items-center flex-wrap gap-1 text-xs"
          style={{ color: "#444" }}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight
                    size={10}
                    aria-hidden="true"
                    style={{ color: "#333" }}
                  />
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    style={{ color: isLast ? "#777" : "#444" }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}