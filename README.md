# Sikaru (सिकारु)

> A playful learning app for children aged 3-7. Built for a classroom smartboard or TV: the teacher calls one child up, and the child learns by seeing, solving, and writing while the class watches.

**Status:** Planning (docs first, code second)
**Type:** Semester project, Kathmandu University
**Languages (UI):** Nepali + English labels, minimal text

**Live website:** [https://sikaru.devstha.com.np/](https://sikaru.devstha.com.np/)

---

## What is Sikaru?

Sikaru has three modules, all designed for small children who cannot read long instructions:

| Module | What the child does |
|---|---|
| **Math Visualizer** | Learns counting, addition, subtraction, multiplication, and more. Each concept is shown in 4-5 visual ways (objects, number line, ten frame, bar model, arrays, and more). The child **watches, builds it with their own hands, then solves**. |
| **Puzzle Playground** | Solves level-based puzzles (shape puzzles first, then others) with hints. |
| **Tracing Canvas** | Starts with pre-writing strokes (lines, curves, circles), then shapes, numbers, and letters (क ख ग, A B C) on a paper-like canvas, with help that fades step by step. The app scores accuracy (1-3 stars) and shows what to improve. |

Plus a **level and reward system** (stars, streaks, personal bests) so progress feels like a game.

## Why it exists

Small children learn by doing, and handwriting in Devanagari depends on *stroke order and direction*, not only the final shape. Most apps ignore this. Schools often have a smartboard or TV but no tablet for every child, so Sikaru is built for "one child at the board, class watching".

**Motto: build a strong foundation.** Understanding comes before speed. Every idea is shown in several ways, and the child builds it with their own hands before being asked for an answer.

## MVP scope (what we build now)

- Math visualizer: counting, add, subtract, multiply (more concepts as stretch), each in 4-5 visual ways with a Watch, Build, Solve flow
- Soft hint system: a bulb icon and a raise-hand button for the teacher; help is always optional and never costs stars
- Puzzle playground: shape puzzles with levels and hints
- Tracing canvas: Nepali letters, digits, English letters, basic shapes, with stroke order check and star score
- Accounts: play as a **guest** in one tap, or sign up with email or Google (student, teacher, or any user); a guest can upgrade without losing progress
- Levels, stars, personal bests (saved to the account)
- Installable PWA: content is cached so activities still play offline (progress saving needs a connection, see `ARCHITECTURE.md`)
- Smartboard-friendly: huge buttons, touch and pen input

## Not now (future scope)

These are deliberately **out of the MVP**. See `PRD.md` section 9 for details.

- Voice and sound: reading letters, numbers, and words aloud in Nepali and English
- Teacher dashboard and class roster
- Parent report
- More subjects and languages

## Tech stack (MVP)

Next.js (App Router) + TypeScript, Tailwind CSS, Zustand, HTML Canvas with Pointer Events, Framer Motion, PWA via Serwist. Server side: Next.js route handlers, **Supabase (PostgreSQL)** for learner progress, **Next  Auth** (email, Google, guest) for accounts, **MongoDB** for learning content (letters, puzzles, levels). Full reasoning is in `ARCHITECTURE.md`.

## Getting started (Windows / PowerShell)

```powershell
git clone <repo-url> sikaru
cd sikaru
npm install
copy .env.example .env.local   # fill in Supabase and MongoDB values

npm run dev
```

Open http://localhost:3000.

Auth setup: in Supabase enable Email, Google, and Anonymous sign-ins (see `ARCHITECTURE.md` section 7.4).

| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Run the scoring-engine unit tests |
| `npm run db:seed` | Validate and upsert bundled math, puzzle, and pre-writing content into MongoDB |

The currently playable activities can use `MONGODB_URI` from `.env.local`, with bundled JSON fallback when MongoDB is unavailable. Supabase variables in `.env.example` are needed when account and saved-progress features are implemented.

## Documentation map

| File | Read it for |
|---|---|
| `PRD.md` | What and why: users, features, goals |
| `ARCHITECTURE.md` | Folder structure, data flow, scoring design |
| `RULES.md` | Coding standards and hard limits (for humans and AI) |
| `PHASES.md` | Step-by-step task list |
| `DESIGN.md` | UI/UX, colors, fonts, layout |
| `MEMORY.md` | Progress log, decisions, resolved bugs |


## License

