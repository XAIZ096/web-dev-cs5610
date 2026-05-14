# Web Dev Notes — Assignment 1

A single-page HTML & CSS practice project covering core web development concepts including semantic structure, SEO, the box model, font sizing, and CSS positioning.

---

## What's Covered

### HTML

- Semantic page structure — navbar, main, sections, footer
- 10 essential HTML tags with descriptions
- SEO meta and header tags with real values used on this page
- 3×3 grid layout using only `div` and `span` with `display: inline-block` — no CSS grid, no flexbox, no table

### CSS

- Box model gallery — border, margin, and padding demonstrated at 0px, 5px, and 10px in a grid layout
- Font size units — the same text in 6 units (px, em, rem, %, pt) with inline styling and explanations
- CSS positioning — static, relative, absolute, and fixed demonstrated through an office desk metaphor

---

## Concepts by Section

| Section                     | Key Concept                                |
| --------------------------- | ------------------------------------------ |
| 01 — Essential HTML Tags    | Semantic HTML, block vs inline             |
| 02 — SEO Meta & Header Tags | `<head>` tags, Open Graph, crawlers        |
| 03 — 3×3 Grid               | `inline-block`, whitespace handling        |
| 04 — CSS Box Model          | Content, padding, border, margin layers    |
| 05 — Font Size Units        | Absolute vs relative units                 |
| 06 — CSS Positioning        | Document flow, containing blocks, viewport |

---

## Design

**Palette**

| Name       | Hex       | Used For                         |
| ---------- | --------- | -------------------------------- |
| Dusty Rose | `#D6A99D` | Navbar, accents, borders         |
| Cream      | `#FBF3D5` | Page background, content areas   |
| Sage       | `#D6DAC8` | Alternate section backgrounds    |
| Teal       | `#9CAFAA` | Footer, highlights, hover states |

**Typography** — DM Serif Display (headings) + DM Sans (body), loaded from Google Fonts.

---

## How to Run

No build tools or dependencies. Open `index.html` directly in a browser.

```bash
open index.html
```

---

## AI Usage

This project was built with assistance from Claude (Anthropic) as a learning aid. AI was used to discuss concepts, suggest implementations, and provide minor code snippets — not to generate the full project at once. All code was reviewed, understood, and integrated manually.

### How AI was used

- Planning the page structure and section order before writing any code
- Discussing visual metaphors for abstract CSS concepts (e.g. the office desk for positioning)
- Suggesting CSS fixes for specific visual problems (e.g. margin not being visible)
- Explaining what individual CSS rules do line by line
- Reviewing tone and language for an assignment context

### Sample prompts used

These are the kinds of prompts used during this project — focused on specific problems:

```
"The margin row in my box model table looks the same across all three columns.
What CSS property on the cell would make the gap visible?"
```

```
"I want to show a wooden desk using only CSS. How can I make it visually appealing?"
```

```
"The ghost outline for the relative position demo should show where the
element originally sat. What would work for this?"
```

```
"My pre tags look strange in Prettier. What is a cleaner alternative
for showing single-line code examples inside a card?"
```

```
"The sticky note in the desk demo needs to look slightly rotated and
handwritten. What CSS properties would give that effect?"
```

```
"I want the code example in each tag card to be scrollable instead of
wrapping. Which two CSS properties do I need?"
```

```
"What css properties here can be extracted to variables?"
```

```
mobile responsive for navbar not working. what to change in css? hamburger-style approach?
```

---

## Notes

- Footer uses `position: fixed` — this is intentional and part of the positioning task
- The 3×3 grid uses `font-size: 0` on the row to eliminate whitespace gaps between `inline-block` spans
- Box model demo uses nested divs with distinct background colors to make each layer (content, padding, border, margin) visually distinct
