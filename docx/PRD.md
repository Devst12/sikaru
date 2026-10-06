# PRD: Sikaru (सिकारु)

**Version:** 1.0 | **Status:** Draft | **Owner:** Dev

---

## 1. Problem

Children aged 3-7 learn counting, shapes, and handwriting best by seeing and doing. In many Nepali classrooms:

- Children do not have tablets, but the school has a **TV or smartboard**.
- Handwriting practice on paper gives no instant feedback on *how* a child wrote (stroke order, direction, shape).
- Existing apps are mostly English-first, text-heavy, or built for one child on one tablet.

## 2. Vision

A friendly, smooth learning playground where a child comes to the board, plays, writes, and gets gentle, clear feedback, while the whole class watches and learns with them.

## 3. Target users

| User | Description | Needs |
|---|---|---|
| **Primary: Child (3-7)** | Cannot read long text, short attention span, limited fine motor control | Big targets, icons over words, instant friendly feedback, no fear of failure |
| **Secondary: Teacher** | Runs the board, calls one child at a time | Simple start, no setup per lesson, easy level selection, works without internet |
| **Audience: Class** | Watches the child at the board | Large, clear visuals visible from the back of the room |

## 4. Usage scenario

1. Teacher opens Sikaru on the school TV or smartboard and either taps **Play as guest** or signs in (email or Google).
2. Teacher picks a module and level (or the next level is suggested).
3. A child is called up, picks their name or avatar, and plays one round.
4. Result (stars, personal best) shows. The next child comes up.

## 5. Goals and success metrics

| Goal | Measure |
|---|---|
| Children can use it without reading instructions | A 4-year-old completes a round with only icon guidance |
| Tracing feedback is trustworthy | Correct strokes score 2-3 stars, clearly wrong strokes score 0-1, checked against a test set |
| Works in real classrooms | Activities play offline; loads under 3 seconds on school hardware |
| Children understand the idea, not just the answer | In a demo, a child can show the same sum in at least 2 different ways; progress requires success in 2 different ways |
| Feels like a game | Children voluntarily ask to go again (observed in a classroom demo) |
| Semester project quality | Working demo of all 3 modules plus tested scoring engine |

### 5.1 Teaching principles (foundation first)

The main motto of Sikaru is to build the **strongest possible foundation** through conceptual understanding.

1. **Concept before procedure.** The child sees *why* before being asked to do.
2. **Concrete, then pictorial, then abstract.** Real-looking objects first, then pictures and diagrams, then numbers and symbols.
3. **Many ways to see one idea.** Each math concept is shown in 4-5 visual ways, each chosen because it is easy to see and understand.
4. **Understand in two ways.** A level counts as mastered only when the child succeeds in at least 2 different ways.
5. **Understanding before speed.** No timers, no speed scores.
6. **Help is always gentle and optional** (see 6.6).
7. **Same idea in every module.** Writing starts from strokes, puzzles from matching and sorting, math from objects. Each builds from the ground up.

## 6. MVP features

### 6.1 Math Visualizer

**Teaching flow for every way: Watch, Build, Solve.** The child never only watches an animation:

1. **Watch:** a short animation explains the idea with icons.
2. **Build:** the child makes it happen with their hands: drags objects, taps number line hops, fills ten-frame cells. The visual *is* the interaction.
3. **Solve:** a new problem with less help. The equation appears and each number lights up with its part of the picture.
4. **Another way** (at concept level): the same problem is shown in a different way. Mastery needs success in 2 different ways.

The same equation, icons, and per-number colors appear in every way. A way switcher lets the teacher or child view the same problem differently.

**Concepts, their big idea, and the ways to see them** (ways 1-3 are core and built first; ways 4-5 are added after):

| Concept | Big idea | Ways to see it | Priority |
|---|---|---|---|
| Counting | One object, one number | 1 Tap to count; 2 Move each into a box (one-to-one); 3 Ten frame; 4 Dot patterns (see the amount at a glance, like a dice); 5 Number line walk | MVP |
| Addition | Putting together | 1 Merge groups; 2 Number line hops (counting on); 3 Ten frame fill; 4 Part-whole bar (two parts make a whole); 5 Story picture (3 birds + 2 birds) | MVP |
| Subtraction | Taking away, and how far apart | 1 Take away; 2 Number line hop back; 3 Difference by pairing; 4 Ten frame remove; 5 Missing part in the bar | MVP |
| Multiplication | Equal groups, repeated | 1 Equal groups (plates); 2 Repeated jumps on number line; 3 Array (rows x columns); 4 Repeated addition tower; 5 Story picture (egg tray, shelves) | MVP |
| Division | Sharing equally | 1 Fair sharing; 2 Make groups of n; 3 Repeated subtraction on number line; 4 Array split; 5 Fact family with multiplication | Stretch |
| Comparing | More, less, equal | 1 Balance scale; 2 Side-by-side bars; 3 Pairing lines; 4 Number line position; 5 Ten frame compare | Stretch |
| Number bonds | Parts that make a whole | 1 Part-whole; 2 Ten frame (make 5 and 10); 3 Balance; 4 Two-color counters; 5 Number line | Stretch |
| Skip counting | Equal jumps | 1 Number line jumps; 2 Number grid patterns; 3 Groups (pairs, fives); 4 Staircase; 5 Bead string | Stretch |
| Place value | Tens and ones | 1 Tens and ones blocks; 2 Bundles of 10 sticks; 3 Abacus; 4 Expanded-form cards; 5 Number line by tens | Stretch |

- **Levels:** number ranges grow (within 5, 10, 20); ways rotate by level; help is reduced step by step.
- **Answering:** large number buttons, or by building the answer in the Build stage.
- **Cut order if time is short:** stretch concepts first, then ways 4-5 of the MVP concepts. Ways 1-3 of counting, addition, subtraction, and multiplication are never cut.
- Division and place value suit the older end of the range (about 6-7). Counting suits ages 3-5.

### 6.2 Puzzle Playground

- Level-based. Each level has a goal, a hint, and a reward.
- Types for MVP: **shape puzzles** (drag pieces into a silhouette) and **normal puzzles** (matching and pattern completion).
- **Skill ladder (foundation first):** match identical shapes, sort by one feature (color or size), complete simple patterns, fit shapes into a silhouette, then multi-piece puzzles.
- Hints use the shared soft hint system (6.6). No time pressure.
- Difficulty rises by number of pieces and similarity of shapes.

### 6.3 Tracing Canvas

**Foundation first: understand strokes before letters.** Writing is taught in this order:

1. **Pre-writing strokes:** standing line, sleeping line, slanting lines, curves, circle, zigzag, loop.
2. **Shapes:** circle, square, rectangle, triangle.
3. **Digits.**
4. **Letters,** grouped by the strokes they share (group order to be confirmed with the school textbook).

- Paper-style canvas (ruled lines for letters).
- Content for MVP:
  - Pre-writing strokes
  - Nepali consonants and vowels (rolled out in phases)
  - Digits 0-9 (and Nepali digits ०-९)
  - English A-Z
  - Shapes: circle, square, rectangle, triangle
- **The writing ladder (5 steps of help, from most to least):**
  1. **Watch the pen:** an animated pen shows the stroke.
  2. **Follow the dots:** numbered start dots and direction arrows.
  3. **Trace the guide:** child traces over a visible guide.
  4. **Fading guide:** only a faint guide remains.
  5. **Write from memory:** blank canvas.

  Levels move the child down the ladder; the hint bulb can always move them back up a step.
- **Scoring** (details in `ARCHITECTURE.md`): coverage, precision, stroke order, stroke direction.
- Feedback is shown in 3 stars plus a visual overlay: green where good, soft orange where to improve.
- **Stretch: Build the letter.** Child drags stroke pieces into the correct order to assemble a letter, to understand how it is made.

### 6.4 Accounts, learners, levels and rewards

**Accounts**

- **Guest:** one-tap **Play as guest**. Progress is saved to a temporary guest account tied to that browser, so a teacher can start at the board immediately.
- **Sign up or log in:** email + password, or Google. Roles at signup: student, teacher, parent, other.
- A guest can **upgrade** to a full account and keeps all progress.
- Signed-in users get their data on any device after login.
- An account can be deleted together with all its data.
- Account and settings screens sit behind a simple **adult gate** so children cannot change or delete things by accident.

**Learners**

- An account owns one or more **learner profiles** (nickname + avatar only). Children aged 3-7 never sign up themselves; a teacher, parent, or older student picks the learner at the board.
- A "student" account gets one learner profile created automatically.

**Levels and rewards**

- Stars per attempt (1-3), stored best per item.
- Level unlocks when a threshold is reached.
- Streaks and **personal bests** (Monkeytype-style stats, in a child-friendly form).

### 6.5 Platform

- Installable PWA. App shell and content are cached so activities work offline; progress is saved to the database when online (queued if offline).
- Works on smartboard, TV browser, laptop, and tablet.
- Input: finger, stylus, mouse. Palm rejection where possible.

### 6.6 Hint system (soft help)

Help must feel like a kind friend, never like a test or a penalty.

- **Bulb icon:** a calm lightbulb is visible on every activity screen. A **raise-hand icon** sits next to it to call the teacher.
- **Invited, never forced.** After about 12 seconds of no action, or after two gentle misses, the bulb glows softly once. Nothing pops up, nothing speaks, nothing reveals the answer.
- **Four gentle levels**, shown with icons, not text:
  1. **Look:** the relevant area glows softly and the rest dims a little.
  2. **Try this:** a ghost hand slowly shows the first move.
  3. **Together:** the mascot does part of it and the child finishes.
  4. **Ask your teacher:** the mascot raises its hand and a small **Teacher Card** appears.
- **Teacher Card:** short text in Nepali and English for the adult at the board: what to say, a question to ask the child, and the common mix-up. This is how "ask the teacher to guide" works in a classroom with one shared screen.
- **No pressure:** hints never reduce stars, score, or progress. The child never sees a hint counter or the word "wrong". The number of hints is stored for adults only.
- Every activity type ships with its hints (math ways, puzzles, and tracing), not as an afterthought.

## 7. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | 60 fps drawing; stroke latency under 50 ms |
| Offline | All activities play with no network; progress syncs when the connection returns |
| Privacy | Learners: only nickname, avatar, and scores. Accounts: email, role, and display name, managed by Supabase Auth. No photos, raw strokes, or tracking. Databases are accessed only from the server. Passwords never touch our code |
| Accessibility | High contrast, large touch targets (minimum 64 px, 96 px preferred), no timers that punish |
| Reliability | Scoring engine covered by unit tests |
| Compatibility | Latest Chrome and Edge; test on a low-end device |

## 8. Out of scope for MVP

Everything in section 9, plus: multiplayer, chat, ads, payments, AI-generated content.

## 9. Future scope (not now)

Documented so the architecture does not block them. **Do not build in MVP.**

| Future feature | Notes |
|---|---|
| **Voice and sound** | Read letters, numbers, and words aloud in Nepali and English; sound effects and background music. Needs recorded or TTS audio assets and an audio layer. |
| **Teacher dashboard** | Class roster, per-student progress, weak letters, printable reports |
| **Parent report** | Weekly summary a teacher can share |
| **More sign-in options** | Phone/OTP login, school-managed accounts |
| **More content** | More subjects (words, colors, animals), more languages (Maithili, Newari, Hindi) |
| **Handwriting model** | ML-assisted letter recognition to complement geometric scoring |
| **Adaptive difficulty** | Auto-adjust level from performance history |
| **Authoring tool** | Teachers or admins add new letters and puzzles without code |

## 10. Risks

| Risk | Mitigation |
|---|---|
| Stroke scoring feels unfair | Tune tolerances with real child-like drawings; keep star thresholds generous |
| Devanagari strokes are complex (connected top line, conjuncts) | Start with simple letters; model the shirorekha (top line) as its own stroke |
| Smartboard touch quirks | Test early on real hardware; support pointer events |
| School internet is unreliable | Content cached and bundled; progress saves queued and retried (see `ARCHITECTURE.md` section 8) |
| Guest sign-ins could be abused | Enable captcha, rate limit route handlers |
| Math scope is large (concepts x 4-5 ways) | Build about 9 reusable visual primitives once; each way is a config of a primitive plus a hint spec; ways 4-5 and stretch concepts are cut first |
| Teacher notes and Nepali text need authoring and review | Draft in English, have a teacher review; every item ships with its teacher note |
| Scope too large for a semester | Strict phases; ship modules one at a time |

## 11. Open questions

- Which hardware will the demo use (smartboard, TV with laptop, tablet)?
- Which Nepali letters first? (Proposed: क ख ग घ ङ)
- Do we show Nepali digits, English digits, or both by default?
- Which roles at signup (proposed: student, teacher, parent, other)?
- Who writes or reviews the Nepali teacher notes?
- Which school textbook defines the order of Nepali letters?
- Who owns the Google Cloud project for Google login?
