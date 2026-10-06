# DESIGN: Sikaru

## 1. Design principles

1. **Child first.** A 4-year-old should know what to do without reading.
2. **Big and clear.** The class watches from the back of the room. If it is not readable from 5 meters, make it bigger.
3. **Warm, never harsh.** No red failure screens, no buzzers, no punishment. Mistakes lead to a gentle retry.
4. **Smooth and alive.** Motion explains things (items merge, strokes animate) but never distracts.
5. **One thing at a time.** Each screen has one main action.

## 2. Color palette

Design tokens (define in Tailwind config; never hard-code hex in components).

| Token | Hex | Use |
|---|---|---|
| `bg` | `#FFF8EC` | Warm paper background |
| `surface` | `#FFFFFF` | Cards, canvas |
| `ink` | `#2B2D42` | Main text and drawing ink |
| `primary` | `#4F7CFF` | Main buttons, highlights |
| `math` | `#FF8A3D` | Math module accent |
| `puzzle` | `#8B5CF6` | Puzzle module accent |
| `trace` | `#22B573` | Tracing module accent |
| `star` | `#FFC94A` | Stars and rewards |
| `good` | `#34C38F` | Correct strokes, success |
| `improve` | `#FFA94D` | Soft orange for "try again here" (never red) |
| `guide` | `#C9D1E8` | Ghost guide strokes, ruled lines |
| `hint` | `#FFD966` | Hint bulb glow (soft, never flashing) |

**Contrast:** text on background must meet WCAG AA (4.5:1). `ink` on `bg` passes.
**Do not use red** for errors in child-facing screens.

## 3. Typography

| Use | Font (proposed) | Notes |
|---|---|---|
| Nepali / Devanagari UI | Noto Sans Devanagari (or Mukta) | Choose in Phase 0.3 and test conjuncts |
| English / digits | Baloo 2 or Nunito | Rounded, friendly |
| Tracing guide letters | Noto Sans Devanagari, regular weight | Must look like standard school handwriting; verify against school textbooks |

Sizes (smartboard base, scale down on small screens):

| Role | Size |
|---|---|
| Letter on canvas | 320 px and up |
| Big numbers (math) | 120 px |
| Button label | 32 px |
| Small label | 20 px minimum (never smaller) |

## 4. Layout

- **Base canvas:** 1920x1080, landscape. Must adapt down to 768 px wide tablet.
- **Safe margins:** 48 px.
- **Home screen:** three huge module cards in a row (Math, Puzzles, Trace), each with a large icon, short label, and its accent color. A profile avatar sits in the top corner.
- **Module screens:** top bar (back, level, stars), center stage (activity), bottom bar (primary action).
- **Tracing screen:** paper canvas fills about 70% of the screen; letter choices or level strip on the side; large Clear and Done buttons.
- **Left-handed and right-handed:** keep action buttons away from the writing area (bottom center or top corners) so a hand does not cover them.

## 5. Components

| Component | Rules |
|---|---|
| **Button** | Min 96 px height for primary, min 64 px for secondary, 24 px radius, press animation scale 0.96 |
| **Module card** | Large icon, one word label, accent color, hover/press lift |
| **StarRow** | 3 stars, animated fill one by one; empty stars are outlined, not grey-crossed |
| **Mascot** | Friendly character that reacts (cheer, think, wave). Simple SVG, few states |
| **Level strip** | Circles with numbers or icons; locked levels show a soft padlock, not a cross |
| **Modal** | Rounded, big close icon, never blocks with a fast timer |
| **Feedback overlay** | Green for good strokes, soft orange for improve areas, dotted guide for missed areas |

## 6. Tracing screen details

- Paper style: warm white with faint ruled lines (top line, middle line, base line) matching Nepali/English school notebooks.
- **The writing ladder (5 steps, most help to least):**
  1. *Watch the pen:* animated pen draws the stroke.
  2. *Follow the dots:* numbered start dots and direction arrows.
  3. *Trace the guide:* visible guide in `guide` color.
  4. *Fading guide:* very faint guide.
  5. *Memory:* no guide.
- Ink: smooth, slightly thick line (round caps), `ink` color. Smoothing applied to avoid jagged lines.
- Result: stars animate, overlay fades in, buttons "Try again" and "Next".

## 7. Motion

| Moment | Motion |
|---|---|
| Items merge (addition) | Groups slide together over 600-800 ms, ease-in-out, count pops up |
| Item removal (subtraction) | Fade and float up one by one, 300 ms each |
| Equal groups (multiplication) | Groups appear one after another, then gather |
| Star earned | Scale-in with a small bounce |
| Button press | Scale 0.96, return 120 ms |
| Level up | Short confetti burst (can be skipped) |

Respect `prefers-reduced-motion`: replace movement with fades.

## 8. Language and text

- Interface uses **icons plus a very short label** (Nepali by default, English toggle).
- No paragraphs on child-facing screens.
- Teacher-facing screens (settings, profile management) may use short text.
- All strings live in one translation file; never hard-code text in components.

## 9. Icons and imagery

- Math items: apple, ball, star, flower (simple, friendly, flat colors, thick rounded outlines).
- Same icon represents the same value across one equation.
- Style: flat, rounded, high contrast, no tiny details.

## 10. Accessibility checklist

- [ ] Touch targets at least 64 px (primary 96 px)
- [ ] Text contrast at least 4.5:1
- [ ] No information conveyed by color alone (stars and shapes accompany colors)
- [ ] Reduced motion supported
- [ ] Works with finger, stylus, and mouse
- [ ] No flashing content
- [ ] Readable from the back of a classroom (tested on real screen)

## 11. Math teaching visuals

**Flow:** every way uses **Watch, Build, Solve**, shown by a step indicator with big icons (eye, hand, star). A fourth icon (two arrows) means **Another way**.

**Way switcher:** a row of 4-5 large icon tabs at the top, one per way (objects, number line, grid, bar, picture). The equation bar stays at the bottom; as the child acts, each number in it lights up with its part of the picture.

**Number colors (same in every way):** first number `math` orange, second number `primary` blue, result `good` green.

| Primitive | Visual and interaction |
|---|---|
| Objects | Large objects the child taps, drags into a tray or box, merges, takes away (fade and float, never a red cross), pairs with lines, or deals onto plates |
| Number line | Line from 0 to 20 with a mascot that hops; child taps to make each hop; arcs use the operand color; hops go left for subtraction; landing point glows |
| Ten frame | 2 x 5 grid; tapping fills cells in operand colors, row by row |
| Part-whole bar | One long bar split into two parts; child drags objects into the parts and the whole fills |
| Grid | Rows and columns for arrays; child fills rows; number grid highlights skip-count patterns |
| Story | A simple everyday scene (for example mangoes on a tree, eggs in a tray); child acts on it |
| Balance | A seesaw that tips toward the heavier side and levels when equal |
| Base-ten | Tens rods and ones cubes, bundles of sticks, or abacus columns the child fills |
| Beads | A bead string the child slides in groups |

**Rules for Build:**

- Objects are large SVG shapes (at least 96 px) with generous grab areas, and snap into slots.
- A wrong action makes the object bounce gently back. No penalty, no sound of failure.
- At most 20 objects on screen.
- Hints come only through the bulb (see section 13).

## 12. Welcome and account screens

- **Welcome:** two huge buttons: **Play as guest** (primary, 96 px or larger, mascot beside it) and **Sign in / Create account** (secondary). Guest is first so a teacher at the board starts in one tap.
- **Sign up (for adults and older students):** role chips with icons (student, teacher, parent, other), email and password fields, and a **Continue with Google** button that follows Google's branding rules. Short text only.
- **Guest chip:** a small, non-blocking "Save your progress" chip with an upgrade action. It never interrupts a child's round.
- **Learner picker:** a row of big avatars for the account's learners, and a "+" to add one.
- **Adult gate:** account, settings, and delete screens need a press-and-hold (about 3 seconds) so children do not open them by accident.

## 13. Hint system

- **Bulb:** a soft warm lightbulb icon (token `hint`), 96 px, in a bottom corner away from the writing hand. Always visible, calm, never red, never flashing. The **raise-hand** icon sits beside it.
- **Idle nudge:** after about 12 seconds without action, or after two gentle misses, the bulb glows with two slow pulses, once. No popup, no sound, no text. With reduced motion, show a static ring instead.
- **Tapping the bulb** opens a small friendly bubble that does not cover the activity, with four icon steps:
  1. **Look** (eyes): the helpful area glows and everything else dims slightly.
  2. **Try this** (hand): a ghost hand slowly shows the first move.
  3. **Together** (two hands): the mascot does part, the child finishes.
  4. **Ask your teacher** (raised hand): the mascot raises its hand and the Teacher Card appears.
- **Teacher Card:** a small panel with icon headings and short Nepali and English text: *Say*, *Ask the child*, *Common mix-up*. Tap anywhere to close. No adult gate, since the teacher is standing at the board.
- **Language of help:** the mascot never says "wrong"; it says "let's look together" through gestures and icons.
- **No scoring effect:** no hint counter on screen, no lost stars.
- **Tracing hints:** the bulb replays the pen animation, then shows the start dot and arrows, then temporarily moves to a more guided step, then the Teacher Card.

## 14. Future design notes (not now)

- Audio cues and spoken prompts will need visual equivalents already in place (icons, highlights), which this design provides.
- Teacher dashboard will use a calmer, denser layout than the child screens.
