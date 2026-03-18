# 🎨 SyncBoard: Real-Time Collaborative Whiteboard

SyncBoard is a high-performance, interactive drawing platform built with **Next.js**, **TypeScript**, and **WebSockets**. It enables multiple users to collaborate on a shared digital canvas in real-time and features a competitive "Scribble" game mode (Draw & Guess).

> **Current Status:** 🏗️ **Feature Integration.** Core real-time drawing is functional. Finalizing the "Scribble" game loop, including role rotation and guess validation.

---

## 🏗️ System Architecture

The application is built with a focus on low-latency event broadcasting and type-safe communication:

* **Frontend (Next.js):** Utilizes the **App Router** and **HTML5 Canvas API** for high-performance rendering.
* **Real-Time Layer (WebSockets):** Manages bi-directional communication, ensuring that drawing strokes and game states are synchronized across all connected clients instantly.
* **Game Engine:** A server-side controller that manages the logic for the "Scribble" mode, handling word assignment and player turns.

---

## 🚀 Key Features

* **⚡ Simultaneous Drawing:** Multiple users can draw on the same canvas at once with sub-second latency.
* **🎮 Scribble Mode:** A dedicated game mode where one player draws a secret word while others attempt to guess it in a live chat interface.
* **🛠️ Creative Toolkit:** Full support for custom brush colors and thicknesses.
* **🔒 Type-Safe Events:** Uses **TypeScript** interfaces to define socket payloads, preventing data inconsistencies between client and server.

---

## 🔬 Technical Deep Dive

### 🖌️ Real-Time Stroke Synchronization
Instead of sending heavy image data, SyncBoard transmits lightweight **coordinate packets**. When a user moves their brush, the coordinates are emitted via WebSockets. Receiving clients then replicate the path locally, ensuring a smooth visual experience for all participants.

### 🎮 Scribble Game Logic (In-Progress)
* **Role Management:** The system handles the transition between "Drawer" and "Guesser" roles.
* **Validation Engine:** Real-time string matching to detect when a player has correctly guessed the secret word.
* **Timer & Rounds:** (Coming soon) Automated round transitions to keep the game flow dynamic.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Real-Time** | WebSockets (Socket.io / WS) |
| **Styling** | Tailwind CSS |
| **Canvas** | HTML5 Canvas API |

---

## ⚙️ Setup & Installation

1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/jakkrol/SyncBoard.git](https://github.com/jakkrol/SyncBoard.git)
    cd SyncBoard
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Launch Development Server:**
    ```bash
    npm run dev
    ```







This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
