# 🏙️ SF Stays

> A handcrafted Airbnb listing explorer for San Francisco — featuring vibe-based filtering, a Hidden Gem algorithm, card flip details, and smooth amenity scrolling. Built with vanilla HTML, CSS, and JavaScript.

---

## 📌 Project Objective

SF Stays fetches and displays the first 50 Airbnb listings from a local JSON dataset using AJAX (`fetch` / `async await`). Each listing card shows the name, description, host, amenities, price, and thumbnail. Three creative features elevate the experience beyond the brief:

- **Vibe Filter** — multi-select mood tags (`🍳 Cook at Home`, `🐾 Pet-Friendly`, `🛁 Luxury`, etc.) that animate cards in and out with AND logic
- **✦ Hidden Gem Detector** — a scoring algorithm that badges listings with high ratings (≥ 4.7★), few reviews (≤ 75), and good value — truly under-the-radar stays
- **Card Flip** — clicking any card flips it to reveal full details: host info, bed/guest stats, untruncated description, all amenities, and availability bars for 30/60/90 days

---

## 🛠️ Tech Requirements

| Requirement                      | Version                             |
| -------------------------------- | ----------------------------------- |
| Browser                          | Chrome 90+, Firefox 88+, Safari 14+ |
| Python _(for local server)_      | 3.x                                 |
| Node.js _(optional)_             | 16+                                 |
| VS Code Live Server _(optional)_ | Any                                 |

> No npm packages, no build tools, no frameworks. Pure HTML/CSS/JS.

---

## ✨ Features

- 🌗 **Dark / Light theme toggle** — respects OS preference on first load
- 🎭 **Multi-select Vibe Filter** — combine tags with AND logic; click an active tag to deselect; filtered cards appear smoothly
- ✦ **Hidden Gem badge** — algorithmic scoring weighted by rating (50%), novelty/low reviews (35%), and value/price (15%); hard cap at 75 reviews so popular listings never qualify
- 🃏 **Card flip** — click any card to flip it and reveal full details; scrollable back face with host info, stats, all amenities in a wrapped grid, and animated availability bars; click ✕ to flip back
- 🖱️ **Amenity pills** — auto-scroll on card hover; click and drag manually to scroll; edge fades update based on scroll position
- 📖 **Read more / less** — expandable descriptions on the front face; card grows naturally to fit content
- 💨 **Staggered card entry** — smooth staggered fade-in animation on load
- 👆 **Click hint tooltip** — slides up on card hover to signal the card is interactive

---

## 🤖 AI Usage

This project was built with the assistance of [Claude](https://claude.ai) (Anthropic) for targeted enhancements and problem-solving. AI was not used to generate the full codebase — it was consulted for specific implementation questions and UI improvements throughout the build.

### Sample prompts used

> _"How can I make the amenity pills horizontally scrollable inside a fixed-width card?"_

> _"The filter transition is instant and jarring — what's the smoothest way to animate cards in and out of a CSS grid without using display:none?"_

> _"I want the pills to auto-scroll on card hover but also support manual drag. How do I handle both without them conflicting?"_

> _"There's a blur/bleed effect on the card border when the amenity track is animating — what's causing it and how do I fix it?"_

> _"What's a simple scoring algorithm to detect 'hidden gem' listings based on rating, number of reviews, and price?"_

> _"How do I support multi-select on filter tags so clicking an active tag deselects it, and selecting multiple applies AND logic?"_

> _"My fetch works fine on a local server but breaks when opening the HTML file directly — why?"_

> _"I want clicking a card to flip it and show more details on the back. How do I structure the HTML and CSS for a card flip without the back face taking up layout space?"_

> _"When I expand the description with read more, the card height is fixed so I can't scroll to click show less — how do I fix this?"_

All AI suggestions were reviewed, tested, and integrated manually. Final implementation decisions, project structure, and design direction were made by the author.

---

This project is for educational purposes. Listing data sourced from the [Inside Airbnb](http://insideairbnb.com) dataset.
