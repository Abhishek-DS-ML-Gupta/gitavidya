"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchIcon, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-lg font-bold text-primary">
            Gitavidya
          </Link>
          <span className="ml-4 text-muted-foreground">/ Search</span>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Search</h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters, verses, keywords..."
            className="flex-1 rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
          </Button>
        </form>

        {loading && <p className="text-muted-foreground">Searching...</p>}

        {!loading && searched && results.length === 0 && (
          <p className="text-muted-foreground">No results found.</p>
        )}

        <div className="space-y-3">
          {results.map((r: any, i: number) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{r.type}</p>
                <p className="text-sm">{r.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
