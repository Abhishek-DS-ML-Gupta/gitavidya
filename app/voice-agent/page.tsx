"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Youtube,
  Play,
  FileText,
  RefreshCw,
  Mic,
  Volume2,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function VoiceAgentPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [audios, setAudios] = useState<any[]>([]);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [voiceName, setVoiceName] = useState("Default");
  const [ttsText, setTtsText] = useState("");
  const [groqQuestion, setGroqQuestion] = useState("");
  const [groqAnswer, setGroqAnswer] = useState("");
  const [groqLoading, setGroqLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const loadVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/videodb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list" }),
      });
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos || []);
        setAudios(data.audios || []);
      }
    } catch {}
  }, []);

  const handleUpload = async () => {
    if (!youtubeUrl.trim()) return;
    setLoading(true);
    setStatus("Uploading...");
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
        setStatus("Uploaded! Processing...");
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
      } else if (data.status === "processing") {
        setStatus("Generating...");
        pollTranscript(videoId, 1);
      }
    } catch (err: any) {
      setStatus(`Failed: ${err.message}`);
    }
  };

  const pollTranscript = async (videoId: string, attempt: number) => {
    if (attempt > 20) { setStatus("Timed out."); setLoading(false); return; }
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
    setStatus("Loading player...");
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
      }
    } catch (err: any) {
      setStatus(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setStatus("Generating speech...");
    setAudioUrl(null);
    try {
      const res = await fetch("/api/videodb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "speak",
          text,
          voiceName,
        }),
      });
      const data = await res.json();
      if (data.success && data.signedUrl) {
        setAudioUrl(data.signedUrl);
        setStatus("Speech ready");
        setTimeout(() => audioRef.current?.play(), 500);
      } else {
        setStatus("No audio generated (TTS may need sandbox setup)");
      }
    } catch (err: any) {
      setStatus(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const askGroq = async () => {
    if (!groqQuestion.trim()) return;
    setGroqLoading(true);
    setGroqAnswer("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: groqQuestion, style: "beginner" }),
      });
      const data = await res.json();
      const answer = data.answer || "No answer received.";
      setGroqAnswer(answer);
      // Auto-speak the answer with cloned voice
      handleSpeak(answer);
    } catch (err: any) {
      setGroqAnswer(`Error: ${err.message}`);
    } finally {
      setGroqLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-lg font-bold text-primary">
            Gitavidya
          </Link>
          <span className="ml-4 text-muted-foreground">/ Voice Agent</span>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Voice Agent</h1>
        <p className="text-muted-foreground mb-8">
          Clone a voice from a YouTube reference video, then ask AI questions and hear
          answers spoken in that voice.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Voice Reference */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Youtube className="h-5 w-5 text-red-500" />
                  1. Add Voice Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="YouTube lecture URL..."
                    className="flex-1 rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                  />
                  <Button onClick={handleUpload} disabled={loading || !youtubeUrl.trim()}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Youtube className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Voice name selector */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Voice Name (for TTS)
                  </label>
                  <select
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value="Default">Default</option>
                    {audios.map((a: any) => (
                      <option key={a.id} value={a.name || a.id}>
                        {a.name || a.id}
                      </option>
                    ))}
                    {videos.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {v.name || v.id}
                      </option>
                    ))}
                  </select>
                </div>

                {status && <p className="text-sm text-muted-foreground">{status}</p>}
              </CardContent>
            </Card>

            {/* Reference videos list */}
            <div className="space-y-3">
              {videos.map((v: any) => (
                <Card key={v.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="text-sm font-medium truncate">{v.name || "Untitled"}</p>
                        <p className="text-xs text-muted-foreground">
                          {v.length}s &middot; {v.status}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => handleTranscript(v.id)} disabled={loading}>
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleStream(v.id)} disabled={loading}>
                          <Play className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" size="sm" onClick={loadVideos} className="w-full">
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
              </Button>
            </div>

            {/* Transcript */}
            {transcript && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" /> Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-3">
                  <p className="text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">{transcript}</p>
                </CardContent>
              </Card>
            )}

            {/* Player */}
            {playerUrl && (
              <Card>
                <CardContent className="p-0 overflow-hidden rounded-lg">
                  <iframe src={playerUrl} className="w-full aspect-video" allow="autoplay; fullscreen" allowFullScreen />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - TTS + Groq */}
          <div className="space-y-6">
            {/* TTS Direct Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Volume2 className="h-5 w-5 text-primary" />
                  2. Text-to-Speech
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  placeholder="Type any text to hear it spoken in the cloned voice..."
                  rows={3}
                  className="w-full rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <Button
                  onClick={() => handleSpeak(ttsText)}
                  disabled={loading || !ttsText.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Volume2 className="h-4 w-4 mr-1" />
                  )}
                  Speak
                </Button>
                {audioUrl && (
                  <audio ref={audioRef} controls className="w-full mt-2">
                    <source src={audioUrl} />
                  </audio>
                )}
              </CardContent>
            </Card>

            {/* Groq + Voice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  3. Ask AI + Voice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  value={groqQuestion}
                  onChange={(e) => setGroqQuestion(e.target.value)}
                  placeholder="Ask about Bhagavad Gita..."
                  rows={2}
                  className="w-full rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <Button
                  onClick={askGroq}
                  disabled={groqLoading || !groqQuestion.trim()}
                  className="w-full"
                >
                  {groqLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Send className="h-4 w-4 mr-1" />
                  )}
                  Ask & Speak Answer
                </Button>
                {groqAnswer && (
                  <Card className="bg-muted">
                    <CardContent className="p-3 text-sm whitespace-pre-wrap">
                      {groqAnswer}
                    </CardContent>
                  </Card>
                )}
                {audioUrl && groqAnswer && (
                  <audio ref={audioRef} controls className="w-full">
                    <source src={audioUrl} />
                  </audio>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          AI explanation inspired by timeless wisdom. Voice powered by VideoDB OMNIVOICE.
        </p>
      </main>
    </div>
  );
}
