import { getChapterByNumber, loadShlokasByChapter } from "@/lib/loader";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ChapterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const chapterNum = parseInt(params.id, 10);
  const chapter = getChapterByNumber(chapterNum);
  if (!chapter) notFound();

  const shlokas = loadShlokasByChapter(chapterNum);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center gap-4">
          <Link href="/chapters">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-lg font-bold text-primary">Gitavidya</span>
          <span className="text-muted-foreground">/ Chapter {chapterNum}</span>
        </div>
      </header>

      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Chapter {chapterNum}: {chapter.translation}
          </h1>
          <p className="text-lg text-muted-foreground">{chapter.transliteration}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {chapter.name} — {chapter.verses_count} verses
          </p>
          <p className="text-muted-foreground max-w-3xl">{chapter.summary.en}</p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Verses</h2>
        <div className="space-y-3">
          {shlokas.map((sh) => (
            <Link
              key={sh._id}
              href={`/chapters/${chapterNum}?verse=${sh.verse}`}
            >
              <div className="rounded-lg border p-4 transition-colors hover:border-primary/50 cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-muted-foreground mb-1">
                      {sh._id}
                    </p>
                    <p className="font-serif text-lg leading-relaxed">
                      {sh.slok.split("\n")[0]}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 italic line-clamp-1">
                      {sh.transliteration}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
