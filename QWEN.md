# Gemini Plan: Nutrition Match Game (Web-Based)

## 🎯 Project Goal
Build a web-based "match-3" style game (inspired by Candy Crush) where kids match healthy food items (fruits, vegetables, proteins, grains, etc.) instead of candies. The game should also educate them by showing fun nutrition facts whenever they make matches.

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript (with React.js for UI components)
- **Game Engine/Logic:** Phaser.js (simple 2D game framework)
- **Animations:** Framer Motion or CSS animations
- **Backend (optional in MVP):** Node.js + Express (only if we need multiplayer or leaderboards)
- **Database (optional in MVP):** Firebase or PostgreSQL for storing scores, progress, and user accounts
- **Hosting:** Vercel, Netlify, or GitHub Pages (for MVP)

---

## 📌 Development Phases

### Phase 1: Core MVP
- Grid layout (8x8 or smaller for kids, e.g., 5x5).
- Tiles = Nutrition sources (carrots, apples, milk, rice, fish, eggs, etc.).
- Basic "match-3" mechanic (swap adjacent tiles, check for 3+ in a row/column).
- Remove matched tiles and drop new ones.
- Show **short nutrition fact quotes** after each match.
  - Example: Match 3 carrots → "Carrots are good for eyesight! They have Vitamin A."
  - Match 3 milk tiles → "Milk makes bones strong because it has calcium!"
- Simple score counter.
- Small levels (goal = score X points or clear Y tiles).

### Phase 2: Enhanced Gameplay
- Level progression system (Level 1: carrots + apples, Level 2: add milk, etc.).
- Moves counter (player wins if goal reached before running out of moves).
- Fun sound effects & animations.
- Add more nutrition fact quotes for variety.

### Phase 3: Engagement Features
- Basic leaderboard (local storage for MVP, database later).
- Unlock new food groups as levels progress.
- Star rating system (1–3 stars per level based on performance).

### Phase 4: Educational Expansion
- Mini "Nutrition Facts" screen accessible from menu.
- Random fun facts shown at the end of each level.
- Progress tracking (kids can see which nutrition groups they've explored).

### Phase 5 (Optional): Social/Advanced Features
- Multiplayer challenge mode (who scores higher in limited moves).
- Parent dashboard (to track learning progress).
- Daily nutrition challenges.

---

## 📚 Nutrition Facts Examples
- Carrots 🥕 → "Carrots help your eyesight with Vitamin A."
- Spinach 🌱 → "Spinach makes you strong! Full of iron."
- Milk 🥛 → "Milk has calcium that builds strong bones."
- Fish 🐟 → "Fish is brain food with omega-3 fatty acids."
- Eggs 🍳 → "Eggs give you protein to grow muscles."
- Rice 🍚 → "Rice gives you energy with carbohydrates."
- Apples 🍎 → "Apples keep you healthy with fiber and Vitamin C."

---

## 🎨 Design & UX
- Bright, colorful cartoon-style food icons.
- Levels should be **short and simple** (kids under 12 → attention span friendly).
- Reward animations (sparkles, stars, confetti).
- Fun feedback when completing a match.

---

## ✅ Deliverables
- A working MVP web game hosted online.
- Nutrition fact messages integrated into gameplay.
- Small level-based progression (with 3–5 levels for MVP).
- Basic sound and visual effects.

---

## 🗂️ Project Files Structure (Proposal)
```
/nutrition-match-game
  /public
    index.html
  /src
    /assets (food icons, sounds, images)
    /components (React UI components)
    /game (Phaser.js logic)
    /data (nutrition facts JSON)
    App.js
    index.js
  package.json
  README.md
  gemini.md
```
