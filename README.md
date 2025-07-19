# Web Coding Terminal

A lightweight, client-side coding terminal built with React, Vite, Tailwind CSS, Framer Motion, and shadcn/ui style primitives.

## Features

* **Resizable docked terminal** — anchored to bottom, left, and right with draggable top edge.
* **Light & dark mode** — toggles using Tailwind `dark:` utilities (`localStorage.theme`).
* **Sidebar tabs** — recent chats, file tree, and settings (model/tool selection).
* **Command‑prompt UI** — type `/help`, `/model`, etc., or arbitrary text (currently echoes back).
* **Vanilla JS with JSDoc** — no TypeScript.

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Building

```bash
npm run build
```

## Folder Structure

```
.
├── src
│   ├── components   # UI components
│   ├── App.jsx      # top‑level layout
│   └── main.jsx     # Vite entry
└── index.html
```