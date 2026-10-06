# ARCHITECTURE: Sikaru

## 1. Principles

1. **Offline-playable, server-backed.** Activities run in the browser from cached content. A thin server layer (Next.js route handlers) is the only thing that talks to the databases. The browser uses Supabase **only for sign-in and sessions**, never for data queries.
2. **Content is data, not code.** Letters, puzzles, and levels live in JSON; the engine reads them.
3. **Scoring engine is pure TypeScript** (no React, no DOM), so it is easy to unit test.
4. **Future-ready seams.** Audio, sync, and teacher features plug in through interfaces without rewriting modules.

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Familiar stack, good PWA story |
| Styling | Tailwind CSS | Fast, consistent tokens |
| State | Zustand | Small, simple, no boilerplate |
| Drawing | HTML Canvas + Pointer Events | Low latency, works with finger/pen/mouse |
| Animation | Framer Motion | Smooth icon motion for the math module |
| API | Next.js route handlers | One server layer; database secrets never reach the browser |
| Relational DB | Supabase (PostgreSQL) + Prisma | Students, attempts, bests, progress |
| Auth | Supabase Auth (`@supabase/ssr`: email, Google, anonymous guest) | Login, guest mode, cookie sessions |
| Content DB | MongoDB (official driver) | Flexible documents for letter templates, puzzles, levels |
| PWA | Serwist (service worker) | Offline caching |
| Testing | Vitest (+ Playwright later) | Unit tests for scoring |
| Validation | Zod | Validate content JSON |

**Not used in MVP:** analytics, audio libraries, a separate NestJS service.

## 3. Folder structure

```
sikaru/
├─ README.md  PRD.md  ARCHITECTURE.md  RULES.md  PHASES.md  DESIGN.md  MEMORY.md
├─ public/
│  ├─ icons/                 # PWA icons
│  └─ content/               # static assets (svg icons for math items)
├─ src/
│  ├─ app/                   # Next.js routes
│  │  ├─ layout.tsx
│  │  ├─ page.tsx            # Home: module picker
│  │  ├─ math/page.tsx
│  │  ├─ puzzles/page.tsx
│  │  ├─ trace/page.tsx
│  │  ├─ welcome/page.tsx    # Play as guest, or sign in
│  │  ├─ login/page.tsx
│  │  ├─ signup/page.tsx
│  │  ├─ auth/callback/route.ts   # email + Google callback
│  │  ├─ profile/page.tsx    # learners + account (behind adult gate)
│  │  └─ api/                # route handlers: students, attempts, progress, content
│  ├─ modules/
│  │  ├─ math/
│  │  │  ├─ primitives/      # reusable visuals: objects, numberLine, tenFrame, partWhole, grid, ...
│  │  │  ├─ ways/            # config per way: which primitive + behavior + hint spec
│  │  │  ├─ stages/          # Watch, Build, Solve, Another way
│  │  │  └─ components/      # icons, equation bar, method switcher
│  │  ├─ puzzles/            # puzzle board, pieces, hint logic
│  │  └─ trace/              # canvas, guide animation, feedback overlay
│  ├─ engine/                # PURE TS, no React
│  │  ├─ scoring/            # resample, coverage, precision, order, direction
│  │  ├─ levels/             # unlock rules, star thresholds
│  │  └─ geometry/           # point, distance, path helpers
│  │  ├─ hints/              # PURE: hint ladder (look, tryThis, together, askTeacher)
│  │  └─ math/               # PURE: problems, scene specs, build and answer checks, mastery rule
│  ├─ content/               # source-of-truth JSON: seeded into MongoDB, bundled as offline fallback
│  │  ├─ letters/            # prewriting.json, nepali.json, english.json, digits.json, shapes.json
│  │  ├─ puzzles/
│  │  └─ math-levels.json
│  ├─ store/                 # Zustand stores
│  ├─ server/                # SERVER ONLY, never imported by client code
│  │  ├─ supabase/           # Prisma client + repositories (PostgreSQL)
│  │  ├─ mongo/              # Mongo client + content repositories
│  │  ├─ auth.ts             # requireUser(), ownership checks
│  │  └─ env.ts              # validated environment variables
│  ├─ client/                # fetch wrappers, sync outbox, Supabase Auth browser client
│  ├─ components/            # shared UI (Button, StarRow, Mascot, Modal, HintBulb, RaiseHand, TeacherCard)
│  ├─ lib/                   # utils, constants
│  ├─ services/              # interfaces for future features (audio)
│  └─ styles/
├─ middleware.ts             # refreshes the auth session on each request
├─ prisma/                   # schema.prisma + migrations
├─ scripts/                  # seed-content.ts (JSON -> MongoDB)
├─ tests/                    # engine tests and fixtures
└─ package.json
```

## 4. Data flow

### 4.1 Tracing (core flow)

```
Pointer events (canvas)
   -> raw strokes [{points:[{x,y,t}]}]
   -> normalize to 0-1 box + resample to N points per stroke
   -> compare with template strokes (content/letters/*.json)
   -> engine/scoring returns { coverage, precision, order, direction, stars }
   -> trace module renders overlay (green good / orange improve)
   -> store updates attempt -> POST /api/attempts (queued if offline)
   -> Supabase saves attempt, updates best score and progress
```

### 4.2 Math

```
level config -> engine/math generates a Problem (concept, operands, answer)
   -> picks a way (rotates by level) -> engine builds a SceneSpec for that way
   -> the way's primitive (modules/math/primitives/*) draws the scene
   -> Watch: the scene plays its steps as an animation
   -> Build: child drags/taps; engine validates each action (validateBuildStep)
   -> Solve: child answers or builds with less help; engine checks (checkAnswer)
   -> Another way: same problem in a different way (mastery needs 2 ways)
   -> store update -> POST /api/attempts (includes way and hintsUsed)
```

### 4.3 Puzzles

```
puzzle config (JSON: silhouette + pieces + snap targets)
   -> drag pieces -> snap check within tolerance -> hint ladder
   -> complete -> stars by completion (hints never reduce stars) -> store -> POST /api/attempts
```

### 4.4 Sign-in, guest, and saving

```
Open app -> Welcome screen
   -> "Play as guest": signInAnonymously() -> anonymous user + session cookie
   -> or Sign up / Log in (email + password, or Google) -> /auth/callback -> session cookie
   -> first API call: requireUser() verifies the token -> upsert accounts row
   -> pick or create a learner -> play -> POST /api/attempts { learnerId, ... }
   -> handler checks the learner belongs to the user -> Prisma writes to Supabase
Guest upgrade: updateUser({ email, password }) or linkIdentity('google') on the SAME user
   -> same user id, so all progress is kept
```

### 4.5 Hint flow

```
Child is idle ~12 s, or misses twice -> bulb glows softly once (no popup)
   -> child taps bulb -> engine/hints getHint(state, level)
   -> level 1 look: highlight targets, dim the rest
   -> level 2 tryThis: ghost hand plays the first step
   -> level 3 together: mascot auto-plays N steps, child finishes
   -> level 4 askTeacher (or raise-hand any time): TeacherCard shows teacherNote
   -> hintsUsed is stored with the attempt; stars are NOT affected
```

## 5. Content format (examples)

**Letter template** (`content/letters/nepali.json`):

```json
{
  "id": "ka",
  "glyph": "क",
  "script": "devanagari",
  "level": 1,
  "strokes": [
    { "id": 1, "role": "body", "path": [[0.30,0.20],[0.30,0.80]], "direction": "down" },
    { "id": 2, "role": "shirorekha", "path": [[0.15,0.15],[0.85,0.15]], "direction": "right" }
  ],
  "tolerance": 0.08
}
```

Coordinates are normalized (0-1). Real templates use denser polylines or sampled SVG paths. **Stroke order and direction are part of the data.** Authoring templates is a manual, tested task (see `PHASES.md`).

### 5.1 Math teaching model

Each **concept** has 4-5 **ways** to see it. Every way follows **Watch, Build, Solve**. A way is a configuration of a reusable **primitive**, so about nine visual components cover every way.

```ts
type Concept = "counting" | "add" | "subtract" | "multiply" | "divide"
             | "compare" | "bonds" | "skip" | "placeValue";
type Primitive = "objects" | "numberLine" | "tenFrame" | "partWhole" | "grid"
               | "balance" | "baseTen" | "story" | "beads";
type WayDef = { id: string; concept: Concept; primitive: Primitive;
                behavior: string; core: boolean; hint: HintSpec };
type Problem = { concept: Concept; operands: number[]; answer: number; icon: string };
type SceneSpec = { way: string; objects: SceneObject[]; steps: SceneStep[]; targets: BuildTarget[] };
```

| Primitive | Ways that use it |
|---|---|
| `objects` | tap to count, move to box, merge groups, take away, pairing, equal groups, fair sharing, make groups, pairs and fives |
| `numberLine` | counting walk, hops, hop back, repeated jumps, repeated subtraction, compare position, skip counting, tens then ones |
| `tenFrame` | count, fill, remove, compare, make 5 and 10 |
| `partWhole` | add bar, missing part, number bonds, fact family |
| `grid` | array, array split, number grid, repeated addition tower |
| `balance` | compare, equal-sides bonds |
| `baseTen` | blocks, bundles, abacus, expanded cards |
| `story` | story pictures for add and multiply (Nepali everyday scenes) |
| `beads` | bead string for skip counting and bonds |

- `engine/math` produces the `Problem` and `SceneSpec` and decides correctness. **Primitives are dumb:** they draw the scene and report what the child did.
- `steps` drive Watch; `targets` define what counts as a correct action in Build.
- The same operands and icons are reused across ways, and each operand keeps one color.
- **Mastery rule:** a concept level is mastered when the learner earns at least 2 stars in at least 2 different ways (`attempts.way`). Level unlocks use mastery, never speed.

**Math level config** (`content/math-levels.json`):

```json
{
  "id": "add-1",
  "concept": "add",
  "max": 5,
  "icon": "apple",
  "ways": ["merge", "numberLineHops", "tenFrameFill", "partWholeBar", "story"],
  "help": { "watch": "full", "build": "guided", "solve": "none" },
  "choices": 3
}
```

### 5.2 Hint content

```ts
type HintLevel = "look" | "tryThis" | "together" | "askTeacher";
type HintSpec = {
  look: { targets: string[] };                // object ids to glow softly
  tryThis: { step: SceneStep };               // first move shown by a ghost hand
  together: { autoSteps: number };            // steps the mascot plays for the child
  teacherNote: {
    say: { ne: string; en: string };          // what to say
    ask: { ne: string; en: string };          // a question to ask the child
    mixUp?: { ne: string; en: string };       // common misunderstanding
  };
};
```

- `engine/hints` exposes `getHint(state, level)`: pure, no UI, fully tested.
- Math ways, puzzles, and tracing letters each provide a `HintSpec`. Zod validation rejects an item with no `teacherNote`.
- Tracing hints: replay the pen, show start dot and arrows, temporarily move to a more guided step, then the Teacher Card.

## 6. Scoring design (tracing)

Inputs: user strokes `U`, template strokes `T`, tolerance `tol` (normalized).

1. **Normalize** user drawing to the template box. Resample each stroke to a fixed number of points (for example 64).
2. **Coverage** = fraction of template points that have a user point within `tol`. (Did the child draw the whole letter?)
3. **Precision** = fraction of user points that are within `tol` of the template. (Did the child stay on the letter?)
4. **Order** = whether strokes were drawn in the template's order (1 if yes, penalty per swap).
5. **Direction** = per stroke, compare start to end direction against the template (dot product of direction vectors).
6. **Final score** = weighted sum:

```
score = 0.30*coverage + 0.23*precision + 0.25*direction + 0.22*order
stars: >=0.80 -> 3, >=0.60 -> 2, >=0.35 -> 1, else 0
```

The current weights and star thresholds are constants in `app/engine/scoring/constants.ts`; weights were tuned against the initial perfect, shaky, partial, scribble, reversed-direction, and wrong-order fixtures. Early levels may disable order/direction scoring (shapes, simple digits) through a per-level flag; active weights are renormalized when a check is disabled.

**Feedback overlay:** user points beyond `tol` render soft orange; template regions not covered render as a gentle dotted hint.

## 7. Persistence

Two databases, one hard rule: **browsers never talk to a database directly.** All access goes through route handlers in `src/app/api/`, using server-only environment variables.

### 7.1 Supabase (PostgreSQL via Prisma): accounts and progress

| Table | Fields |
|---|---|
| `accounts` | id (uuid, equals the Supabase auth user id), role (`guest`, `student`, `teacher`, `parent`, `other`), displayName, isGuest, createdAt |
| `classrooms` | id, ownerId (account), name, createdAt |
| `learners` | id, accountId, classroomId (nullable), nickname, avatar, createdAt |
| `attempts` | id, learnerId, module, itemId, way (nullable), score, stars, hintsUsed (default 0), createdAt |
| `bests` | learnerId + itemId (composite key), bestScore, bestStars, updatedAt |
| `progress` | learnerId + module (composite key), unlockedLevel, streak, lastPlayedAt |

Notes:

- Prisma migrations are the only way to change the schema.
- Use the Supabase **pooled** connection string at runtime and the **direct** one for migrations (set both in `.env`).
- **Prisma connects with a privileged role that bypasses RLS**, so every route handler and repository must check that the learner belongs to the signed-in user. This is mandatory, not optional.
- Still enable Row Level Security on all tables with no public policies (deny by default) as a second layer.
- Raw stroke points are **not** stored, only scores.

### 7.2 MongoDB: learning content

The current implementation stores documents in one `learning_content` collection, distinguished by `kind`:

| `kind` | Source JSON | Holds |
|---|---|---|
| `math-counting` | `content/math-counting.json` | A counting prompt, answer, and visual objects |
| `shape-pairs` | `content/shape-pairs.json` | Shape matching pairs |
| `prewriting` | `content/prewriting.json` | Seven ordered pre-writing stroke guides |

- Bundled JSON in the repo is the source of truth and offline fallback.
- `npm run db:seed` loads `.env` and Zod-validates each document before upserting it by `{ kind, id }` into MongoDB. It creates a unique compound index on those fields.
- `GET /api/content?kind=...` reads only the supported kinds, validates MongoDB results with Zod, and returns bundled JSON if the database is empty or unavailable. This endpoint is public because it serves learning content, not learner data.
- The route uses `MONGODB_URI` on the server. The URI is never returned to the browser or logged.

### 7.3 Why two databases, and the fallback

PostgreSQL is reserved for account-owned attempts and progress. MongoDB holds published learning content. If the content database is unavailable, the current activities use the bundled JSON. The current repo has MongoDB connected; Supabase account and progress wiring still needs a separate Supabase project and environment variables.

### 7.4 Authentication

- **Providers:** Email + password, Google OAuth, and Supabase **anonymous sign-ins** (guest). Enable all three in the Supabase dashboard; add the local and production URLs to the redirect settings, and create a Google OAuth client for Google login.
- **Guest** = an anonymous Supabase user. Progress is saved to the server under that user. If the guest signs out or clears browser data without upgrading, that data is lost; the UI shows a small, non-blocking "save your progress" chip.
- **Upgrade:** linking an email or Google identity to the anonymous user keeps the same user id, so no data is copied or merged.
- **Account row:** created on the first authenticated API call (upsert). Role is chosen at signup and stored in `accounts.role`. In MVP the role does not unlock special data access.
- **Verification:** route handlers verify the user with `supabase.auth.getUser()` and never trust a user id sent by the client.
- **Protection:** enable captcha for anonymous sign-ins and rate limit the API to reduce abuse.
- **Learners:** children aged 3-7 never sign up. An adult or older student account owns their profiles.
- **Deletion:** deleting an account removes its learners, attempts, bests, and progress.

## 8. Offline and PWA

- The service worker precaches the app shell, icons, and the bundled content JSON.
- **Content:** the app requests `/api/content`, caches the response, and falls back to the bundled JSON when offline. Activities always play.
- **Progress:** saves go to `/api/...`. If a save fails or the device is offline, it goes into a small **sync outbox** (an in-memory queue backed by `localStorage`) and retries when the connection returns. The outbox is only a retry queue, not a database; Supabase is the source of truth.
- Version content files; bump `contentVersion` when templates change.

## 9. Future seams (build interfaces only when needed, not now)

| Future feature | Seam |
|---|---|
| Voice and sound | `services/audio.ts` interface with `play(id)`; modules call it through a no-op default. Content items already carry stable `id` values to map to audio files. |
| Phone/OTP login | Add as a Supabase Auth provider; route handlers do not change |
| Teacher dashboard | `accounts.role`, `classrooms`, `learners`, `attempts`, `bests` already hold what a dashboard needs |
| ML recognition | `engine/scoring` exposes one `scoreAttempt()`; an ML scorer can be added as an alternative strategy |

## 10. Testing strategy

- **Unit (must):** geometry helpers, resampling, each scoring component, star thresholds.
- **API (should):** route handler tests with mocked repositories; seed script validated against the Zod schemas.
- **Math engine (must):** generated problems have correct answers; every method for the same problem ends at the same answer; build-step validators accept correct actions and reject wrong ones.
- **Hints (must):** every ladder level returns a valid highlight or ghost step; hints never change stars; items without a `teacherNote` fail validation.
- **Auth and ownership (must):** unauthenticated calls return 401; account A cannot read or write account B's learners.
- **Fixtures:** `tests/fixtures/` holds sample strokes: perfect, shaky, wrong order, wrong direction, too small, scribble.
- **Component tests:** star display, level unlock.
- **Manual:** run on a real smartboard or TV before the demo.
