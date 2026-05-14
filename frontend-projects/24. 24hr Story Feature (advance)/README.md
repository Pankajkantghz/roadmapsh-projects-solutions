<img width="1333" height="625" alt="image" src="https://github.com/user-attachments/assets/1c1ccd26-11b2-4b58-a6aa-09ff45582f3e" />
![Uploading image.png…]()


# 24hr Story Feature

A modern and elegant Story Feature inspired by Instagram, Snapchat, and WhatsApp built using React, Redux Toolkit, Tailwind CSS, and Vite.

Users can upload image stories, view them in a fullscreen immersive viewer, navigate between stories, delete stories, and automatically remove expired stories after 24 hours.

---

## ✨ Features

- 📸 Upload image stories
- 🖼️ Fullscreen immersive story viewer
- ⏱️ Auto-progress story timer
- 📊 Animated progress bars
- ▶️ Next / Previous story navigation
- 🗑️ Delete stories
- 💾 localStorage persistence
- 🕒 Automatic 24-hour story expiry
- ⚡ Redux Toolkit state management
- 🪝 Custom hooks architecture
- 🎨 Modern responsive UI
- 🌑 Cinematic overlay gradients
- 📱 Mobile-app inspired experience

---

## 🛠️ Tech Stack

- React
- Redux Toolkit
- React Redux
- Tailwind CSS
- Vite
- React Icons

---

## 📂 Folder Structure

```bash
src/
│
├── components/
│   ├── ProgressBars.jsx
│   ├── StoryBar.jsx
│   ├── StoryCard.jsx
│   ├── StoryViewer.jsx
│   └── UploadButton.jsx
│
├── hooks/
│   ├── useStoryPersistence.js
│   ├── useStoryUpload.js
│   └── useStoryViewer.js
│
├── features/
│   └── stories/
│       └── storiesSlice.js
│
├── utils/
│   ├── storage.js
│   ├── storyExpiry.js
│   └── formatTime.js
│
├── data/
│   └── defaultStories.js
│
├── store/
│   └── store.js
│
├── App.jsx
└── main.jsx
```

---

## 🚀 Installation

Clone the repository:

```bash
git clone <your-repo-url>
```

Move into the project directory:

```bash
cd 24hr-story-feature
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## 🧠 Concepts Practiced

This project helped me learn and practice:

- Redux Toolkit architecture
- Global state management
- Custom React hooks
- React `useEffect`
- Timer and interval cleanup
- File uploads with FileReader
- Image compression concepts
- localStorage persistence
- State synchronization
- UI layering and visual hierarchy
- Production-style folder structure
- React component separation
- Feature-based architecture

---

## 🎯 Challenges Solved

- Managing auto-progress intervals correctly
- Synchronizing Redux state with localStorage
- Avoiding stale `useEffect` state
- Preventing memory leaks with cleanup functions
- Handling large image uploads
- Designing immersive fullscreen UI
- Structuring scalable React architecture

---

## 📌 Future Improvements

- 📱 Swipe gestures for mobile navigation
- 🔥 Viewed / unviewed story indicators
- ☁️ Cloud image storage
- 🔐 Authentication system
- 🧑 User profiles
- 💬 Story captions
- 🎞️ Story transition animations
- 🌐 Backend API integration
- 🖱️ Drag & drop uploads
- ❤️ Story reactions

---

## 📷 Preview

_Add screenshots or demo GIF here_

---

## 📄 License

This project is open source and available under the MIT License.
