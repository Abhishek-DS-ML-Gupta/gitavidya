# AGENTS.md

## Project
AI Bhagavad Gita Learning Platform — browse 18 chapters, 700+ verses, 21 commentaries, ask AI questions with Prompt Guard safety.

## Data Layer (Do Not Modify)
- **`data/chapters/`** — 18 JSON files, one per chapter. Fields: `chapter_number`, `verses_count`, `name`, `translation`, `transliteration`, `meaning` (en/hi), `summary` (en/hi)
- **`data/slok/`** — 714 JSON files, one per verse. Named `bhagavadgita_chapter_{c}_slok_{v}.json`. Fields: `_id` (e.g. "BG1.1"), `chapter`, `verse`, `slok`, `transliteration`, plus 21 commentator keys (`tej`, `siva`, `purohit`, `chinmay`, `san`, `adi`, `gambir`, `madhav`, `anand`, `rams`, `raman`, `abhinav`, `sankar`, `jaya`, `vallabh`, `ms`, `srid`, `dhan`, `venkat`, `puru`, `neel`, `prabhu`). Each commentator: `author`, `et`, `ec`, `ht`, `hc`, `sc`

## Groq Setup
Two Groq agents:
1. **Prompt Guard** — `meta-llama/llama-prompt-guard-2-22m` — checks input safety before answering
2. **Main Model** — `llama-3.3-70b-versatile` — answers with RAG context

API key in `.env.local` (already set).

## Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page with features links |
| `/chapters` | All 18 chapters grid |
| `/chapters/[id]` | Single chapter with verse list |
| `/chat` | AI chat with 6 explanation styles |
| `/search` | Search across all chapters + verses |
| `/voice` | Upload YouTube links, extract voice transcripts via VideoDB |

## VideoDB Setup
- API key in `.env.local` as `VIDEO_DB_API_KEY`
- Uses `videodb` npm package via `connect(apiKey)` pattern
- Auto-creates `bhagavad-gita` collection on first use
- Supports: YouTube upload, transcript extraction, streaming, semantic search across videos
- Endpoint: `POST /api/videodb` with actions: `upload`, `transcript`, `stream`, `search`, `list`

## AI Pipeline
User Question → Prompt Guard check → Search local dataset → RAG context → Groq → Response

## Commands
```bash
npm run dev       # Dev server
npm run build     # Production build
npm run lint      # Lint check
npm run typecheck # TypeScript check
```

## Rules
- Never modify dataset files (`data/chapters/`, `data/slok/`)
- Server components for data fetching (`lib/loader.ts`)
- AI must state "AI explanation inspired by..." — never impersonate teachers
- Strict TypeScript, shadcn/ui, dark mode default
- Verify with `lint → typecheck → build` before commit
