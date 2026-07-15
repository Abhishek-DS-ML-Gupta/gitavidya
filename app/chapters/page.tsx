import { loadChapters } from "@/lib/loader";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChaptersPage() {
  const chapters = loadChapters();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-lg font-bold text-primary">
            Gitavidya
          </Link>
          <span className="ml-4 text-muted-foreground">/ Chapters</span>
        </div>
      </header>

      <main className="container py-12">
        <h1 className="text-4xl font-bold mb-2">All Chapters</h1>
        <p className="text-muted-foreground mb-8">
          Browse all 18 chapters of the Bhagavad Gita.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch) => (
            <Link key={ch.chapter_number} href={`/chapters/${ch.chapter_number}`}>
              <Card className="h-full transition-colors hover:border-primary/50 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Chapter {ch.chapter_number}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {ch.verses_count} verses
                    </span>
                  </div>
                  <CardTitle className="text-xl">{ch.translation}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {ch.summary.en}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
