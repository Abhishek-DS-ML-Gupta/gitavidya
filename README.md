# Gitavidya — AI Bhagavad Gita Learning Platform

Explore 18 chapters, 700+ verses, and 21 commentaries with AI-powered explanations.

## Features

- **AI Chat** — Ask any Gita question with 6 explanation styles (Beginner, Student, Story, Practical, Detailed, Short)
- **Chapter Explorer** — Browse all 18 chapters with Sanskrit, transliteration, and summaries
- **Smart Search** — Search across all verses, chapters, and commentaries
- **21 Commentaries** — Access translations by Shankaracharya, Ramanuja, Prabhupada, and more
- **Voice & Video** — Upload YouTube lectures, extract transcripts, and stream videos
- **Voice Agent** — Clone a voice from a reference video and hear AI answers spoken aloud
- **Prompt Guard** — Input safety check before every AI response

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Groq](https://groq.com/) — Prompt Guard + llama-3.3-70b-versatile
- [VideoDB](https://videodb.io/) — Video processing, TTS, voice cloning

## Getting Started

```bash
npm install
cp .env.local.example .env.local
```

Fill in your API keys in `.env.local`:

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Groq API key for AI and Prompt Guard |
| `VIDEO_DB_API_KEY` | VideoDB API key for video/voice features |

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check |

## Project Structure

```
├── ai/              # RAG context + AI pipeline
├── app/             # Next.js App Router pages
│   ├── api/         # API routes (chat, search, videodb)
│   ├── chapters/    # Chapter explorer
│   ├── chat/        # AI chat
│   ├── search/      # Smart search
│   ├── voice/       # YouTube upload & player
│   └── voice-agent/ # Voice cloning & TTS
├── components/      # shadcn/ui components
├── data/            # Dataset (do not modify)
│   ├── chapters/    # 18 chapter JSON files
│   └── slok/        # 714 verse JSON files
├── lib/             # Utilities (groq, videodb, loader)
└── types/           # TypeScript types
```

## Dataset

- **18 chapters** in `data/chapters/` — chapter_number, verses_count, name, translation, transliteration, meaning, summary
- **714 verses** in `data/slok/` — Sanskrit, transliteration, 21 commentator keys
- Do not modify dataset files

## AI Pipeline

```
User Question → Prompt Guard (safety check) → Search local dataset → RAG context → Groq → Response
```

## Voice Agent

1. Upload a YouTube reference video
2. Select it as the voice source
3. Ask AI a Gita question — the answer is read aloud in the cloned voice
4. Or type custom text for TTS

Powered by VideoDB OMNIVOICE sandbox.
