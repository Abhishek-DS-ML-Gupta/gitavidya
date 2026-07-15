"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { BookOpen, Search, MessageCircle, Sparkles, BookMarked, GraduationCap, ArrowRight, Youtube, Mic } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: MessageCircle,
    title: "Ask AI",
    desc: "Ask any question about any verse or chapter and get instant AI explanations.",
    href: "/chat",
  },
  {
    icon: BookOpen,
    title: "Chapter Explorer",
    desc: "Browse all 18 chapters with summaries, Sanskrit text, and transliteration.",
    href: "/chapters",
  },
  {
    icon: Search,
    title: "Smart Search",
    desc: "Search by verse number, chapter, keyword, or topic across all 700+ verses.",
    href: "/search",
  },
  {
    icon: Sparkles,
    title: "6 Explanation Styles",
    desc: "Choose from Beginner, Student, Story, Practical, Detailed, or Short.",
    href: "/chat",
  },
  {
    icon: BookMarked,
    title: "21 Commentaries",
    desc: "Access translations by Shankaracharya, Ramanuja, Prabhupada, and more.",
    href: "/chapters",
  },
  {
    icon: Youtube,
    title: "Voice & Video",
    desc: "Extract voice transcripts from YouTube lectures for sloka references.",
    href: "/voice",
  },
  {
    icon: Mic,
    title: "Voice Agent",
    desc: "Clone a voice from a video and hear AI answers spoken aloud.",
    href: "/voice-agent",
  },
  {
    icon: GraduationCap,
    title: "Prompt Guard Safe",
    desc: "Protected by AI prompt guard — safe learning environment.",
    href: "/chat",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Gitavidya</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/chapters" className="text-sm text-muted-foreground hover:text-foreground">
              Chapters
            </Link>
            <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground">
              AI Chat
            </Link>
            <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">
              Search
            </Link>
            <Link href="/voice" className="text-sm text-muted-foreground hover:text-foreground">
              Voice
            </Link>
            <Link href="/voice-agent" className="text-sm text-muted-foreground hover:text-foreground">
              Voice Agent
            </Link>
            <ThemeToggle />
            <Link href="/chat">
              <Button size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Ask AI
              </Button>
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Understand the{" "}
                <span className="text-primary">Bhagavad Gita</span>{" "}
                with AI
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                700+ verses, 21 commentaries, AI-powered explanations — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/chat">
                  <Button size="lg" className="gap-2">
                    <Sparkles className="h-5 w-5" />
                    Ask AI Now
                  </Button>
                </Link>
                <Link href="/chapters">
                  <Button size="lg" variant="outline" className="gap-2">
                    <BookOpen className="h-5 w-5" />
                    Explore Chapters
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold">Everything You Need</h2>
              <p className="mt-2 text-muted-foreground">
                Browse, search, and ask — all powered by the complete Bhagavad Gita.
              </p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Link key={feature.title} href={feature.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full transition-colors hover:border-primary/50 cursor-pointer group">
                      <CardHeader>
                        <feature.icon className="h-10 w-10 text-primary" />
                        <CardTitle className="text-xl flex items-center gap-2">
                          {feature.title}
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.desc}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold">Begin Your Journey</h2>
              <p className="mt-4 text-muted-foreground">
                Explore the wisdom of the Gita with AI guidance, 21 authentic commentaries,
                and a prompt-guarded safe learning environment.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/chat">
                  <Button size="lg" className="gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Start Learning
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold">Gitavidya</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI explanation inspired by timeless wisdom. Not a substitute for traditional study.
          </p>
        </div>
      </footer>
    </div>
  );
}
