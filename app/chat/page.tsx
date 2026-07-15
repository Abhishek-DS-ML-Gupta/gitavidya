"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Sparkles, Loader2, BookOpen, Youtube } from "lucide-react";
import Link from "next/link";
import type { ExplanationStyle } from "@/types";

const styles: { value: ExplanationStyle; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "student", label: "Student" },
  { value: "story", label: "Story" },
  { value: "practical", label: "Practical" },
  { value: "detailed", label: "Detailed" },
  { value: "short", label: "Short" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! I'm your AI guide to the Bhagavad Gita. Ask me anything about the Gita's teachings, chapters, verses, or concepts.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState<ExplanationStyle>("beginner");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, style }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process that. Please check your API key and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-lg font-bold text-primary">
            Gitavidya
          </Link>
          <span className="ml-4 text-muted-foreground">/ Ask AI</span>
        </div>
      </header>

      <div className="container flex-1 flex flex-col max-w-3xl mx-auto w-full py-4 gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {styles.map((s) => (
            <Button
              key={s.value}
              variant={style === s.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStyle(s.value)}
              className="whitespace-nowrap"
            >
              {s.label}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 px-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <CardContent className="p-4 text-sm whitespace-pre-wrap">
                  {msg.content}
                </CardContent>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card className="bg-muted">
                <CardContent className="p-4 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the Bhagavad Gita..."
            className="flex-1 rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <div className="flex gap-2">
            <Link href="/voice">
              <Button type="button" variant="outline" size="icon" title="Add YouTube voice reference">
                <Youtube className="h-4 w-4" />
              </Button>
            </Link>
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          AI explanation inspired by timeless wisdom. Not a substitute for
          traditional study.
        </p>
      </div>
    </div>
  );
}
