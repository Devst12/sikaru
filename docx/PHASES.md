# PHASES: Sikaru

> Work **one task at a time**, in order. Do not start a task until the previous one is checked off and logged in `MEMORY.md`.
> Each task has a **Done when** line. If it is not true, the task is not done.

Legend: `[ ]` todo, `[x]` done

---

## Phase 0: Decisions (before code)

- [ ] **0.1** Confirm hardware for demo (smartboard, TV + laptop, or tablet). *Done when:* recorded in `MEMORY.md`.
- [ ] **0.2** Confirm first letter set (proposed: क ख ग घ ङ) and digit style (Nepali, English, or both). *Done when:* recorded in `MEMORY.md`.
- [ ] **0.3** Choose the Devanagari font and test it renders correctly. *Done when:* font name in `DESIGN.md`.
- [ ] **0.4** Confirm signup roles (proposed: student, teacher, parent, other) and who owns the Google Cloud OAuth project. *Done when:* recorded in `MEMORY.md`.

## Phase 1: Project setup

- [ ] **1.1** Create Next.js + TypeScript + Tailwind project. *Done when:* `npm run dev` shows a blank page.
- [ ] **1.2** Add ESLint, Prettier, Vitest, and scripts (`typecheck`, `lint`, `test`). *Done when:* all three commands run clean.
- [ ] **1.3** Create folder structure from `ARCHITECTURE.md` (empty folders with placeholder files). *Done when:* structure matches.
- [x] **1.4** Add Tailwind design tokens from `DESIGN.md` (colors, fonts, radius). *Done when:* a sample button uses tokens only. (2026-10-06: Added shared CSS design tokens and applied them to the home and module screens.)
- [ ] **1.5** Build shared components: `Button` (large), `StarRow`, `Modal`, `Mascot` placeholder. *Done when:* shown on a test page.
- [x] **1.6** Home page with 3 big module cards (Math, Puzzles, Trace). *Done when:* cards navigate to empty pages. (2026-10-06: Added the foundation-first learning garden and linked Math, Puzzles, and Trace starter pages.)
- [ ] **1.7** Create Supabase project, Prisma schema (`accounts`, `classrooms`, `learners`, `attempts` with nullable `method`, `bests`, `progress`), first migration, RLS enabled with no public policies. *Done when:* `npx prisma migrate dev` succeeds and tables exist.
- [ ] **1.8** Create MongoDB cluster, Mongo client, and `scripts/seed-content.ts` skeleton. *Done when:* a test document is written and read back.
- [ ] **1.9** `.env.example` and validated `server/env.ts` (pooled + direct Postgres URLs, Mongo URI). *Done when:* app fails fast with a clear message if a variable is missing.

## Phase 1B: Accounts and guest mode

- [ ] **1B.1** In Supabase enable Email, Google, and Anonymous sign-ins; add redirect URLs; create the Google OAuth client. *Done when:* all three sign-in paths work in dev.
- [ ] **1B.2** Supabase browser and server clients (`@supabase/ssr`) and `middleware.ts` that refreshes the session. *Done when:* the session survives reloads and the server can read the user.
- [ ] **1B.3** `requireUser()` helper and `accounts` upsert on the first request. *Done when:* unauthenticated API calls return 401.
- [ ] **1B.4** Welcome screen with a giant **Play as guest** button and a Sign in / Sign up button. *Done when:* a guest enters the app in one tap.
- [ ] **1B.5** Sign-up with role choice, email + password, and a Continue with Google button; login page. *Done when:* the `accounts` row has the chosen role.
- [ ] **1B.6** Guest upgrade (link email or Google to the anonymous user). *Done when:* a guest's progress is still there after upgrading.
- [ ] **1B.7** Learner profiles: create and choose a learner (nickname + avatar); a student account auto-creates one. *Done when:* ownership tests pass (account A cannot read account B's learners).
- [ ] **1B.8** Sign out and delete account with all data. *Done when:* deletion removes the rows in Supabase.
- [ ] **1B.9** Adult gate (for example press and hold 3 seconds) in front of account and settings screens. *Done when:* a child tapping around cannot reach delete or settings.
- [ ] **1B.10** Captcha for anonymous sign-ins and basic API rate limiting. *Done when:* repeated guest creation from one client is throttled.

## Phase 1C: Soft hint system (shared)

- [ ] **1C.1** `HintBulb` and `RaiseHand` components with the idle glow (about 12 s) and a reduced-motion version. *Done when:* the bulb glows once after idle on a test page, with no popup.
- [ ] **1C.2** `engine/hints`: ladder types and `getHint(state, level)` with tests. *Done when:* each of the four levels returns a valid result.
- [ ] **1C.3** Hint bubble with icon-only steps and the dim-the-rest highlight overlay. *Done when:* the bubble never covers the activity area.
- [ ] **1C.4** `TeacherCard` and the `HintSpec` Zod schema (`teacherNote` in Nepali and English required). *Done when:* an item without a note fails validation.
- [ ] **1C.5** Save `hintsUsed` with attempts. *Done when:* a test shows identical stars with and without hints.

## Phase 2: Scoring engine (no UI yet)

- [ ] **2.1** Geometry helpers: distance, normalize to box, resample stroke to N points. *Done when:* unit tests pass.
- [ ] **2.2** Coverage score. *Done when:* tests pass on perfect and partial fixtures.
- [ ] **2.3** Precision score. *Done when:* tests pass on shaky and scribble fixtures.
- [ ] **2.4** Direction score. *Done when:* tests pass on reversed-stroke fixture.
- [ ] **2.5** Stroke order score. *Done when:* tests pass on wrong-order fixture.
- [ ] **2.6** Combine into `scoreAttempt()` with constants file and star thresholds. *Done when:* the six fixtures produce expected stars.
- [ ] **2.7** Zod schemas for letter templates and content loader. *Done when:* invalid JSON is rejected with a clear error.
- [ ] **2.8** Content repositories (MongoDB) + `/api/content` + bundled JSON fallback loader. *Done when:* letters load from MongoDB, and from bundled JSON when the database is unreachable.

## Phase 3: Tracing module

- [ ] **3.1** Canvas component with Pointer Events (draw, clear, undo last stroke). *Done when:* smooth drawing with finger and mouse.
- [ ] **3.2** Paper-style background with ruled lines and the letter box. *Done when:* visible on large and small screens.
- [ ] **3.2b** Pre-writing strokes (standing line, sleeping line, slanting lines, curves, circle, zigzag, loop): templates + fixtures. *Done when:* each stroke type scores correctly on fixtures.
- [ ] **3.3** Shapes first: circle, square, rectangle, triangle templates + fixtures. *Done when:* a drawn circle scores 3 stars, a scribble scores 0-1.
- [ ] **3.4** Digits 0-9 templates. *Done when:* each digit has a fixture test.
- [ ] **3.5** Writing ladder steps 1-2: Watch the pen, Follow the dots (numbered start dots and arrows). *Done when:* the animation matches stroke order and direction.
- [ ] **3.6** Writing ladder steps 3-5: Trace the guide, Fading guide, Write from memory. *Done when:* level controls the starting step, and the bulb can move the child back up one step.
- [ ] **3.7** Feedback overlay (green good, soft orange to improve) and star result screen. *Done when:* overlay matches score data.
- [ ] **3.7a** Tracing hints through the shared bulb: replay the pen, start dot and arrows, temporary guided step, Teacher Card. *Done when:* each level works and stars never change.
- [ ] **3.8** Nepali set 1: क ख ग घ ङ templates + fixtures + visual check. *Done when:* all five pass tests and a manual check.
- [ ] **3.9** English A-Z templates. *Done when:* all 26 have fixtures.
- [ ] **3.10** Remaining Nepali consonants and vowels, in groups of five. *Done when:* each group is tested before the next starts.
- [ ] **3.11** *(Stretch)* Build the letter: drag stroke pieces into order to assemble a letter. *Done when:* a wrong order bounces back gently and the right order completes the letter.

## Phase 4: Math visualizer (concepts x ways)

**Foundation first:** concept before procedure, many ways to see one idea. Build the **visual primitives** once; each way is a config of a primitive plus its hint spec and teacher note. Per concept, build ways 1-3 (core) first, then ways 4-5. Every way has **Watch, Build, Solve** and ships with its hints.

- [ ] **4.1** Shared UI: equation bar, per-number colors, way switcher, number buttons, step indicator (Watch, Build, Solve, Another way). *Done when:* shown on a test page.
- [ ] **4.2** `engine/math`: types, generator, `validateBuildStep`, `checkAnswer`, mastery rule (2 stars in 2 different ways). *Done when:* unit tests pass, and every way for a problem ends at the same answer.

**Primitives (build once, reuse)**
- [ ] **4.3** `objects` primitive (tap, drag to tray, merge, take away, pair, deal). *Done when:* supports Watch, Build, and the hint ladder.
- [ ] **4.4** `numberLine` primitive (hops forward and back, equal jumps). *Done when:* the mascot hops smoothly and the child can tap each hop.
- [ ] **4.5** `tenFrame` primitive. *Done when:* cells fill in operand colors, row by row.
- [ ] **4.6** `partWhole` bar primitive. *Done when:* two parts fill the whole.
- [ ] **4.7** `grid` primitive (array and number grid). *Done when:* rows and columns fill and total correctly.
- [ ] **4.8** `story` primitive with 3 Nepali everyday scenes. *Done when:* a child can act on a scene (add, multiply).

**Counting (ages 3-5)**
- [ ] **4.9** Core ways: tap to count, move each into a box, ten frame. *Done when:* all three work through Watch, Build, Solve.
- [ ] **4.10** Extra ways: dot patterns (see the amount at a glance), number line walk. *Done when:* both work.

**Addition**
- [ ] **4.11** Core ways: merge groups, number line hops, ten frame fill. *Done when:* the same sum (for example 2 + 3) shows in all three and the numbers highlight in sync.
- [ ] **4.12** Extra ways: part-whole bar, story picture. *Done when:* both work.

**Subtraction**
- [ ] **4.13** Core ways: take away, number line hop back, difference by pairing. *Done when:* each ends on the same answer.
- [ ] **4.14** Extra ways: ten frame remove, missing part in the bar. *Done when:* both work.

**Multiplication**
- [ ] **4.15** Core ways: equal groups, repeated jumps, array. *Done when:* 3 x 2 and 2 x 4 look clearly correct in all three.
- [ ] **4.16** Extra ways: repeated addition tower, story picture. *Done when:* both work.

- [ ] **4.17** Level progression: number ranges, way rotation, reduced help, and mastery gating (2 different ways). *Done when:* a level unlocks only after success in 2 different ways.
- [ ] **4.18** Teacher notes in Nepali and English for every way. *Done when:* Zod validation passes for all ways.

**Stretch (start only after 4.1-4.18 pass; cut first if time is short). Each has 5 ways and each way has hints and a teacher note.**
- [ ] **4.19** Division: fair sharing, make groups, repeated subtraction, array split, fact family.
- [ ] **4.20** Comparing: balance scale, side-by-side bars, pairing lines, number line position, ten frame compare. *(needs the `balance` primitive)*
- [ ] **4.21** Number bonds: part-whole, ten frame, balance, two-color counters, number line.
- [ ] **4.22** Skip counting: number line jumps, number grid patterns, groups, staircase, bead string. *(needs the `beads` primitive)*
- [ ] **4.23** Place value: tens and ones blocks, bundles of sticks, abacus, expanded-form cards, number line by tens. *(needs the `baseTen` primitive)*

## Phase 5: Puzzle playground

- [ ] **5.1** Drag-and-drop engine with snap tolerance. *Done when:* pieces snap smoothly on touch and mouse.
- [ ] **5.2** Shape puzzle format (JSON: silhouette, pieces, targets). *Done when:* one puzzle is playable.
- [ ] **5.3** Puzzle hints through the shared bulb (look, try this, together, ask teacher) with a teacher note per puzzle. *Done when:* all four levels work and never affect stars.
- [ ] **5.4** Normal puzzles: matching and pattern completion. *Done when:* two types playable.
- [ ] **5.5** Levels (at least 10) following the skill ladder (match, sort, pattern, fit, multi-piece) and star rules based on completion only. *Done when:* difficulty visibly rises and hints never change stars.

## Phase 6: Progress and rewards

- [ ] **6.1** Prisma repositories for learners, attempts, bests, progress, plus route handlers, all with ownership checks. *Done when:* repository tests pass and the endpoints return correct data.
- [ ] **6.2** Learner switcher at the board: quick-pick avatars for the signed-in account. *Done when:* switching takes one tap.
- [ ] **6.3** Save attempts, bests, progress via `/api/attempts`. *Done when:* personal bests update correctly in Supabase.
- [ ] **6.4** Streaks, level unlocks (math uses the mastery rule), simple stats screen. *Done when:* stats show per learner.
- [ ] **6.5** Reward moments (confetti, mascot reaction). *Done when:* triggers on 3 stars and level-up.
- [ ] **6.6** Sync outbox: queue saves when offline and retry on reconnect. *Done when:* playing offline, then reconnecting, makes the scores appear in Supabase with no duplicates.

## Phase 7: PWA and polish

- [ ] **7.1** Service worker and manifest. *Done when:* app installs and loads offline.
- [ ] **7.2** Smartboard test (palm touches, large screen). *Done when:* checked on real hardware.
- [ ] **7.3** Performance pass (drawing latency, load time). *Done when:* targets in `PRD.md` met.
- [ ] **7.4** Accessibility pass (contrast, target sizes, reduced motion). *Done when:* checklist in `DESIGN.md` passes.
- [ ] **7.5** Bug bash with real children or child-like test drawings. *Done when:* top issues fixed.
- [ ] **7.6** Security pass: ownership tests, 401 checks, captcha and rate limits, no secrets in the repo. *Done when:* checklist in `RULES.md` section 5a passes.

## Phase 8: Delivery

- [ ] **8.1** Deploy to a host that runs Next.js route handlers, with environment variables set and the production URL added to the Supabase and Google OAuth redirect settings. *Done when:* the public URL works, all sign-in paths work, scores save to Supabase, and activities play offline after first load.
- [ ] **8.2** Demo script and screenshots. *Done when:* a 5-minute walkthrough is ready.
- [ ] **8.3** Final report and documentation update. *Done when:* all `.md` files match the shipped app.

---

## Future backlog (do not start)

| Item | Needs |
|---|---|
| Voice and sound (Nepali + English) | Audio assets, `services/audio.ts` implementation |
| Teacher dashboard and class roster | Data model for classes, reports UI |
| Parent report | Export or share format |
| Phone/OTP login | Supabase Auth phone provider |
| ML handwriting recognition | Dataset, model, alternate scorer |
| Adaptive difficulty | Performance history analysis |
| Content authoring tool | Admin UI for templates and puzzles |
| More languages and subjects | Content and font coverage |
