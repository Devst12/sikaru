# MEMORY: Sikaru

> Living log of progress, decisions, and resolved bugs.
> **Update after every completed task.** Newest entries on top within each section.
> AI assistants: read this file at the start of every session.

## 1. Current status

- **Current phase:** Phase 1 (project setup)
- **Last completed task:** Home learning garden and module starter pages (Phase 1.4, 1.6)
- **Next task:** 1.5 Build shared components (Button, StarRow, Modal, Mascot placeholder)
- **Blockers:** none

## 2. Key decisions

| Date | Decision | Reason |
|---|---|---|
| 2026-10-06 | Project name is **Sikaru** | Chosen by owner |
| 2026-10-06 | MVP has 3 modules: Math Visualizer, Puzzle Playground, Tracing Canvas | Core idea from the owner |
| 2026-10-06 | Voice and sound are **future scope**, not in MVP | Owner decision; keep MVP focused |
| 2026-10-06 | Other extras (teacher dashboard, parent report, ML recognition) are future scope. Login/accounts were first future scope but moved into the MVP later the same day | Owner decision; documented in `PRD.md` section 9 |
| 2026-10-06 | Storage: **Supabase (PostgreSQL via Prisma)** for students and progress, **MongoDB** for learning content. Browsers never access databases directly; all access is through Next.js route handlers | Owner chose Supabase + MongoDB instead of Dexie/IndexedDB |
| 2026-10-06 | Offline: content cached and bundled so activities play offline; progress saves use a small sync outbox that retries on reconnect | School internet is unreliable |
| 2026-10-06 | Accounts are in the MVP: **guest** (Supabase anonymous user) or sign up with **email or Google**; roles student, teacher, parent, other | Owner decision; guests can upgrade without losing data |
| 2026-10-06 | Auth uses Supabase Auth; browser uses it for sign-in only; all data goes through route handlers with ownership checks | Prisma bypasses RLS, so ownership must be checked in code |
| 2026-10-06 | Learners (ages 3-7) never sign up; an account owns learner profiles with nickname + avatar only | Child privacy |
| 2026-10-06 | Math: more concepts than add/subtract (counting, add, subtract, multiply as MVP; division, comparing, number bonds, skip counting, place value as stretch) | Owner decision |
| 2026-10-06 | Each math concept is taught in **4-5 visual ways** (ways 1-3 core, 4-5 built after), each with Watch, Build, Solve; mastery needs success in 2 different ways | Owner decision: strongest conceptual foundation |
| 2026-10-06 | **Foundation-first motto** applies to every module: math from objects, writing from pre-writing strokes, puzzles from matching and sorting; no timers or speed scores | Owner decision |
| 2026-10-06 | **Soft hint system:** bulb icon, raise-hand for the teacher, 4 levels (look, try this, together, ask teacher), Teacher Card in Nepali and English; hints never reduce stars | Owner decision: very child-friendly help |
| 2026-10-06 | Writing ladder has 5 steps (watch the pen, follow the dots, trace the guide, fading guide, memory) | Strong writing foundation |
| 2026-10-06 | Math is built from about 9 reusable visual primitives; each way is a config of a primitive | Keeps 4-5 ways per concept feasible |
| 2026-10-06 | Tracing scoring uses coverage, precision, direction, and stroke order | Devanagari handwriting depends on stroke order, not only final shape |
| 2026-10-06 | Classroom model: one child at the smartboard or TV, class watching | Schools lack tablets for every child |
| 2026-10-06 | Begin the home screen before hardware, font, and account decisions are finalized; use a responsive classroom-first layout and keep unresolved decisions open | Owner asked to start building from the docs |

## 3. Open questions

- [ ] Demo hardware (smartboard, TV + laptop, tablet)?
- [ ] First Nepali letter set (proposed: क ख ग घ ङ)?
- [ ] Default digits: Nepali, English, or both?
- [ ] Devanagari font final choice?
- [ ] Stroke templates: hand-authored, or traced from a school handwriting reference?
- [ ] Hosting target for the deployed app (must run Next.js route handlers)?
- [ ] Signup roles final (student, teacher, parent, other)? Who owns the Google Cloud OAuth project?
- [ ] Who writes or reviews the Nepali teacher notes?
- [ ] Which school textbook defines the order of Nepali letters?
- [ ] Are the stretch math concepts wanted for the demo, or MVP concepts only?

## 4. Progress log

| Date | Task | Result | Notes |
|---|---|---|---|
| 2026-10-06 | Removed broken remote Geist font loading | Turbopack could not resolve its internal Google font module | Removed next/font/google; use system font fallbacks including Nirmala UI for Devanagari. Build compilation succeeds; standalone TypeScript check passes. |
| 2026-10-06 | Foundation-first home and module starters | Done | Added the learning garden, three module cards and destination pages; updated metadata and design tokens. Visual verification not run. |
| 2026-10-06 | Docs set created | Done | Starting point of the project |
| 2026-10-06 | Docs updated: Dexie replaced by Supabase + MongoDB | Done | README, PRD, ARCHITECTURE, RULES, PHASES, MEMORY |
| 2026-10-06 | Docs updated: accounts (guest, email, Google) and math concepts x methods added | Done | All seven files |
| 2026-10-06 | Docs updated: soft hint system, 4-5 math ways per concept, foundation-first principles, writing ladder | Done | All seven files |

## 5. Resolved bugs

| Date | Bug | Cause | Fix |
|---|---|---|---|
| 2026-10-06 | Geist font module not found in Turbopack | next/font/google emitted unresolved internal font URLs | Removed Google font imports and switched to system font fallbacks. |

## 6. Scoring tuning log

Record every change to weights, tolerances, or star thresholds here.

| Date | Change | Reason | Test updated |
|---|---|---|---|
| (initial) | weights 0.35 / 0.30 / 0.20 / 0.15; stars at 0.80 / 0.60 / 0.35 | Starting values, to be tuned with real drawings | not yet |

## 7. Lessons and gotchas

- Guest data lives in the browser's anonymous session; clearing browser data or signing out without upgrading loses it.
- (add as discovered, for example Windows/PowerShell quirks, smartboard touch issues, font rendering problems)

## 8. Future ideas parking lot

Do **not** build these now. Add ideas here instead of coding them.

- Voice and sound (Nepali + English): read letters, numbers, and words aloud
- Teacher dashboard and class roster
- Parent report
- Accounts and cloud sync
- ML handwriting recognition
- Adaptive difficulty
- Content authoring tool
- More subjects and languages
