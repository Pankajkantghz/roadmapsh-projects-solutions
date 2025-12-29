# 📘 Flash Card Learning App

An interactive **Flash Card application** built with **React** and **Tailwind CSS** to help users learn concepts efficiently by flipping cards, navigating between them, and tracking progress.

---
<img width="1913" height="861" alt="image" src="https://github.com/user-attachments/assets/62107516-4ac9-4eec-9253-e3efcf2ae769" />



## 🚀 Features

- 📇 Flash cards with **Question / Answer** view
- 🔁 Flip card to reveal answers
- ⏮️ ⏭️ Navigate between cards (Previous / Next)
- 📊 Visual **progress bar**
- ♻️ Reusable UI components
- 🎨 Clean and responsive UI using Tailwind CSS
- ♿ Accessible and semantic HTML

---

## 🛠️ Tech Stack

- **Frontend:** React (Functional Components)
- **Styling:** Tailwind CSS (v4)
- **State Management:** React `useState`
- **Build Tool:** Vite
- **Language:** JavaScript (ES6+)

---

## 📂 Project Structure

```txt
src/
├── components/
│   ├── ui/
│   │   └── Button.jsx
│   ├── FlashCard.jsx
│   ├── FlashCardContainer.jsx
│   ├── Navigation.jsx
│   └── ProgressBar.jsx
├── data/
│   └── flashcards.json
├── App.jsx
├── main.jsx
├── index.css
└── index.html
🧠 Architecture Overview
txt
Copy code
App
└── FlashCardContainer
    ├── ProgressBar
    ├── FlashCard
    └── Navigation
        ├── Button (Previous)
        ├── Button (Show Answer)
        └── Button (Next)
FlashCardContainer acts as the central controller

State is lifted and passed down via props

User actions flow upward through callback functions

🔄 State Management
State	Description
currentIndex	Tracks the active flash card
isFlipped	Toggles between question and answer

♻️ Reusable Button Component
A shared Button component is used to avoid repeating Tailwind classes.

jsx
Copy code
<Button>&lt; Previous</Button>
<Button>Show Answer</Button>
<Button>Next &gt;</Button>
Features:

Consistent styling

Disabled state handling

Smooth hover transitions

Accessible <button> element

🎨 Styling Strategy
Utility-first styling with Tailwind CSS

Shared styles via reusable components

Smooth UI transitions using:

transition-all

duration-300

ease-in-out

⚠️ Edge Case Handling
Disable Previous button on the first card

Disable Next button on the last card

Reset flip state on navigation

Prevent index overflow

♿ Accessibility
Semantic HTML elements (<button>)

Keyboard-accessible navigation

Disabled state visual feedback

Cursor and hover indicators

🧪 Getting Started
Prerequisites
Node.js (v18+ recommended)

npm

Installation
bash
Copy code
npm install
Run locally
bash
Copy code
npm run dev
🔮 Future Enhancements
Persist progress using LocalStorage

Card flip animations

Multiple decks / categories

Backend integration

Authentication

Mobile swipe gestures

🧠 Learning Outcomes
React component architecture

State lifting and unidirectional data flow

Tailwind CSS best practices

Reusable UI component design

Clean and scalable frontend structure

markdown
Copy code

---

### ✅ What I fixed for GitHub
- Proper fenced code blocks (` ``` `)
- Clean tree structure rendering
- Removed stray `yaml / Copy code`
- Consistent headings & spacing
- GitHub-friendly Markdown

If you want next, I can:
- Add **screenshots section**
- Add **badges (React / Tailwind / Vite)**
- Write a **resume-ready project summary**
- Make a **minimal README version**

Just tell me 👍
