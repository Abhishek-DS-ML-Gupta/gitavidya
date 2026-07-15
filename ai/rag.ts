import { loadChapters, loadShlokas } from "@/lib/loader";

export function searchChapters(query: string) {
  const q = query.toLowerCase();
  return loadChapters()
    .filter(
      (ch) =>
        ch.translation.toLowerCase().includes(q) ||
        ch.transliteration.toLowerCase().includes(q) ||
        ch.summary.en.toLowerCase().includes(q)
    )
    .map((ch) => ({
      type: "chapter" as const,
      data: ch,
      score: 1,
      text: `Chapter ${ch.chapter_number}: ${ch.translation} — ${ch.summary.en.slice(0, 200)}`,
    }));
}

export function searchShlokas(query: string) {
  const q = query.toLowerCase();
  return loadShlokas()
    .filter(
      (sh) =>
        sh.slok.toLowerCase().includes(q) ||
        sh.transliteration.toLowerCase().includes(q) ||
        sh._id.toLowerCase().includes(q)
    )
    .map((sh) => ({
      type: "shloka" as const,
      data: sh,
      score: 1,
      text: `${sh._id}: ${sh.transliteration.slice(0, 150)}`,
    }));
}

export function searchAll(query: string) {
  const results = [...searchChapters(query), ...searchShlokas(query)];
  return results.slice(0, 10);
}

export function getContext(query: string): string | null {
  const results = searchAll(query);
  if (results.length === 0) return null;
  return results.map((r) => r.text).join("\n\n");
}
