# RULES: Sikaru

> Read this file first. These rules apply to every contributor, human or AI.
> If a rule conflicts with a request, **stop and ask**. Do not guess.

## 0. Prime directives

1. **Do only what the current task in `PHASES.md` asks.** No bonus features, no refactors "while you're there".
2. **Do not invent.** If a file, function, package, or API is not in the repo or in the approved stack, do not assume it exists. Say so and ask.
3. **Do not build future scope.** Voice/sound, teacher dashboard, parent report, and ML recognition are **not in the MVP**. Do not add code, packages, or UI for them.
4. **Read before write.** Open the file you are about to change. Match its style.
5. **Small, reviewable changes.** One task, one commit.
6. **Update `MEMORY.md`** after every completed task.

## 1. Approved stack (and nothing else)

Next.js (App Router, route handlers), TypeScript (strict), Tailwind CSS, Zustand, Framer Motion, Serwist, Zod, Vitest, Prisma + Supabase (PostgreSQL), Supabase Auth (`@supabase/ssr`), MongoDB official driver.

**Adding a new dependency requires explicit approval.** State the reason and the alternative before installing.

### Libraries and patterns to avoid

| Avoid | Why / use instead |
|---|---|
| Redux, MobX | Use Zustand |
| Any UI kit (MUI, Chakra, etc.) | Custom components with Tailwind; the UI is child-specific |
| Canvas wrappers (Fabric.js, Konva, Paper.js) | Use plain Canvas + Pointer Events; we need full control and low latency |
| NextAuth/Auth.js, Clerk, Firebase Auth, custom password code | Use Supabase Auth only; never store passwords ourselves |
| Analytics SDKs | No tracking |
| Separate NestJS service | Route handlers are enough; keep one deployable |
| Mongoose | Use the official MongoDB driver + Zod |
| Supabase JS client for **data** queries in browser code, Mongo client in browser code | The browser Supabase client is for auth only; all data goes through route handlers |
| Audio libraries (Howler, Tone, etc.) | Voice/sound is future scope |
| TensorFlow, ONNX, any ML runtime | Future scope |
| `localStorage` for progress | Supabase is the source of truth; `localStorage` is allowed only for the sync outbox |
| `any` type, `@ts-ignore` | Fix the types |
| Inline magic numbers in scoring | Constants file only |
| Mouse events or touch events directly for drawing | Pointer Events only |

## 2. Code standards

- **TypeScript strict mode.** No `any`. Prefer `type` for data, `interface` for contracts.
- **Naming:** components `PascalCase`, hooks `useThing`, files `kebab-case.ts` (components may be `PascalCase.tsx`), constants `UPPER_SNAKE_CASE`.
- **Functions:** small and single-purpose. Engine functions are **pure** (no DOM, no React, no randomness without a seed parameter).
- **Layering:**
  - `engine/` imports nothing from React, `modules/`, `store/`, or `db/`.
  - `modules/` may import `engine/`, `components/`, `store/`.
  - `server/` code is imported only by route handlers, never by client components. Database access goes through repository functions only.
- **Validation:** all JSON in `content/` is validated with Zod at load time.
- **Database changes** go through Prisma migrations (Supabase) and the seed script (MongoDB). Never edit tables or collections by hand.
- **Errors:** never swallow errors silently. Show a friendly child-safe message in the UI and log details for developers.
- **Comments:** explain *why*, not *what*. Document every scoring formula.
- **Formatting:** Prettier + ESLint; no warnings left behind.

## 3. UI rules (child-first)

- Minimum touch target **64 px**; primary buttons **96 px or larger**.
- **Icons over text.** Never require reading to proceed in core flows.
- No timers that punish. No red "wrong" screens. No harsh failure states. Use warm encouragement.
- Every action gets visual feedback within 100 ms.
- Animations must be smooth (aim for 60 fps) and respect `prefers-reduced-motion`.
- Must work on a large smartboard viewport (1920x1080) **and** a small tablet (768 px wide).
- Follow `DESIGN.md` tokens. Do not hard-code colors or fonts.

## 4. Tracing and scoring rules

- Scoring weights, tolerances, and star thresholds live in **one** file: `src/engine/scoring/constants.ts`.
- Any change to scoring needs: a unit test updated or added, and a note in `MEMORY.md`.
- Letter templates must include **stroke order and direction**. Never ship a template without them.
- Teach writing in order: pre-writing strokes, shapes, digits, then letters. Do not add letter groups out of that order.
- Do not store raw stroke points in the database in MVP; store scores only.

## 5. Content rules

- Nepali (Devanagari) text must be Unicode, rendered with the project font. Do not use images of letters.
- Never auto-generate letter templates and ship them untested. Each template needs a fixture test and a visual check.
- Every content item has a **stable `id`** (for example `ka`, `add-1`). Never rename ids after release; future audio and sync depend on them.

## 5a. Auth and account rules

- Every route handler except `/api/content` calls `requireUser()`, which verifies the token with `supabase.auth.getUser()`. **Never trust a user id sent by the client.**
- Every read or write of learner data checks `learner.accountId === user.id` inside the repository. Prisma bypasses RLS, so this check is mandatory and must have tests.
- Guest = Supabase anonymous user. Upgrade by linking an identity. Do not copy or merge data between users unless that feature is explicitly built and tested.
- Learners (ages 3-7) never sign up. Adults and older students create accounts.
- Never store passwords, tokens, or Google profile data. Store only role and display name.
- Roles come from a fixed enum. In MVP a role grants no special data access.
- Never log tokens or emails.
- Account, settings, and delete screens sit behind the adult gate.

## 5b. Math rules

- Each concept offers **4-5 ways to see it**. A way is a config of a reusable **visual primitive** in `modules/math/primitives/` (objects, number line, ten frame, part-whole, grid, balance, base-ten, story, beads), driven by the scene spec from `engine/math/`. Ways 1-3 are core; ways 4-5 are added after the core ways pass their tests.
- Every way follows **Watch, Build, Solve**. An animation alone is not enough; the child must manipulate the visual in Build.
- The same equation, icons, and per-number colors appear across methods so children connect them.
- Problem generation, build-step validation, and answer checking live in `engine/math/` (pure and tested). Renderers never decide correctness.
- A new way = a config for an existing primitive + a hint spec. A new primitive needs approval. Do not change the engine's core types without updating `ARCHITECTURE.md`.
- **Understanding before speed:** no timers and no speed scores in math.
- **Mastery rule:** a level counts as mastered only after at least 2 stars in at least 2 different ways.
- Visual objects are SVG, sized for the smartboard; at most 20 objects on screen in MVP.
- Animation durations are constants, not inline numbers.
- Stretch concepts (division, comparing, number bonds, skip counting, place value) are not started until the MVP concepts pass their tests.

## 5c. Hint rules

- Every activity screen has the **bulb** and the **raise-hand** button from the first release of that activity.
- Hints are **invited, never forced.** The idle nudge is a soft glow only. Never auto-open a hint and never reveal the answer by itself.
- The ladder has four levels (look, try this, together, ask teacher), defined in `engine/hints` (pure, tested).
- Hints **never** reduce stars, score, or progress. The child sees no hint counter. `hintsUsed` is stored for adults only.
- No red, no buzzer, no "wrong" wording anywhere in a hint.
- Teacher Card text is short, in Nepali and English. An item cannot ship without its `teacherNote`.
- Respect `prefers-reduced-motion`: replace the glow with a static ring.

## 6. Testing rules

- Engine code requires unit tests before the task is considered done.
- Fix the code, not the test, unless the test is wrong (explain why in `MEMORY.md`).
- Run `npm run typecheck`, `npm run lint`, and `npm run test` before every commit. All must pass.

## 7. Environment (Windows)

- Commands are written for **PowerShell**. Do not use `rm -rf`, `export`, or `&&` chains that PowerShell does not support. Use `Remove-Item`, `$env:VAR`, and separate lines.
- Use forward slashes in imports. Avoid case-only file renames (Windows is case-insensitive).
- Do not commit `.env`, `.env.local`, `node_modules`, or `.next`. Keep `.env.example` up to date (names only, no values).

## 8. Git rules

- Branch per phase: `phase-1-setup`, `phase-2-trace-engine`, and so on.
- Commit format: `type(scope): message` (for example `feat(trace): add coverage score`).
- Never force-push to `main`.

## 9. Hard boundaries (must never happen)

1. Store only nickname, avatar, and scores. No surnames, photos, contact details, or raw strokes. Never expose database credentials to the browser.
2. Do not add ads, tracking, or third-party scripts.
3. Do not delete or rewrite files outside the current task's scope.
4. Do not change the folder structure in `ARCHITECTURE.md` without updating that file in the same commit.
5. Do not mark a task complete if tests fail.
6. Do not claim something works without running it.
7. Do not let one account read or write another account's learners.
8. Never commit OAuth client secrets or Supabase service keys.

## 10. When unsure

Stop. Ask one clear question. Offer options with a recommendation. Record the decision in `MEMORY.md`.
