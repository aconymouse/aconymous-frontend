// Komponen untuk inject JSON-LD ke <head>
// Google suka banget ini. Anggap aja lo suap Google pake data terstruktur.

export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}