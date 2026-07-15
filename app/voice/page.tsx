"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Youtube,
  Play,
  FileText,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function VoicePage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/videodb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list" }),
      });
      const data = await res.json();
      if (data.success) setVideos(data.videos || []);
    } catch {}
  }, []);

  const handleUpload = async () => {
    if (!youtubeUrl.trim()) return;
    setLoading(true);
    setStatus("Uploading to VideoDB...");
    setTranscript(null);
    setPlayerUrl(null);

    try {
      const res = await fetch("/api/videodb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upload", youtubeUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Uploaded! Transcript generation started...");
        await loadVideos();
        setYoutubeUrl("");
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatus(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTranscript = async (videoId: string) => {
    setLoading(true);
    setStatus("Fetching transcript...");
    setSelectedId(videoId);
    setTranscript(null);
    setPlayerUrl(null);

    try {
      const res = await fetch("/api/videodb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "transcript", videoId }),
      });
      const data = await res.json();
      if (data.success && data.status === "ready") {
        setTranscript(data.transcript);
        setStatus("Transcript ready");
      } else if (data.success && data.status === "processing") {
        setStatus(data.message || "Generating transcript...");
        pollTranscript(videoId, 1);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatus(`Failed: ${err.message}`);
    }
  };

  const pollTranscript = async (videoId: string, attempt: number) => {
    if (attempt > 20) {
      setStatus("Timed out. Try again.");
      setLoading(false);
      return;
    }
    setStatus(`Generating transcript... (${attempt}/20)`);
    await new Promise((r) => setTimeout(r, 5000));
    try {
      const res = await fetch("/api/videodb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "transcript", videoId }),
      });
      const data = await res.json();
      if (data.success && data.status === "ready") {
        setTranscript(data.transcript);
        setStatus("Transcript ready");
        setLoading(false);
        return;
      }
    } catch {}
    pollTranscript(videoId, attempt + 1);
  };

  const handleStream = async (videoId: string) => {
    setLoading(true);
    setStatus("Generating stream...");
    setSelectedId(videoId);
    setTranscript(null);
    setPlayerUrl(null);

    try {
      const res = await fetch("/api/videodb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stream", videoId }),
      });
      const data = await res.json();
      if (data.success && data.playerUrl) {
        setPlayerUrl(data.playerUrl);
        setStatus("Player ready");
      } else {
        setStatus("Stream generation failed");
      }
    } catch (err: any) {
      setStatus(`Failed: ${err.message}`);
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
          <span className="ml-4 text-muted-foreground">/ Voice</span>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-2">Voice & Video</h1>
        <p className="text-muted-foreground mb-8">
          Upload YouTube lecture links to extract voice transcripts for sloka
          references.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Youtube className="h-5 w-5 text-red-500" />
              Add YouTube Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube URL..."
                className="flex-1 rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
              <Button
                onClick={handleUpload}
                disabled={loading || !youtubeUrl.trim()}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Youtube className="h-4 w-4" />
                )}
                Upload
              </Button>
            </div>
            {status && (
              <p className="text-sm text-muted-foreground mt-2">{status}</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {videos.map((v: any) => (
            <Card key={v.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {v.name || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground">ID: {v.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Length: {v.length} sec
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTranscript(v.id)}
                      disabled={loading}
                    >
                      {loading && selectedId === v.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <FileText className="h-4 w-4 mr-1" />
                      )}
                      Text
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStream(v.id)}
                      disabled={loading}
                    >
                      {loading && selectedId === v.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      Play
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {videos.length === 0 && !loading && (
            <p className="text-center text-muted-foreground py-8">
              No videos yet. Add a YouTube link to get started.
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={loadVideos}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh List
          </Button>
        </div>

        {playerUrl && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Play className="h-5 w-5" />
                Video Player
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden rounded-b-lg">
              <iframe
                src={playerUrl}
                className="w-full aspect-video"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </CardContent>
          </Card>
        )}

        {transcript && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Transcript Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {transcript}
              </p>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground text-center mt-8">
          Powered by VideoDB — AI audio/video perception for your learning
          journey.
        </p>
      </main>
    </div>
  );
}
