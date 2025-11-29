# VideoGraph AI

**Generate scene graphs from videos using AI** 🎥✨

Upload any video, extract frames, and transform them into interactive scene graphs powered by Google Gemini.
All processing happens on your machine and through your local backend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-Ready-green.svg)

![VideoGraph Demo](cover.png)

## 🚀 Quick Start

**1. Clone and start the app:**

```bash
git clone https://github.com/YOUR_USER/VideoGraph-AI.git
cd VideoGraph-AI
```

**2. Start the backend:**

```bash
cd backend
npm install
npm run dev
```

**3. Start the frontend:**

```bash
cd ../frontend
npm install
npm run dev
```

**4. Open your browser:**

* Go to **[http://localhost:5173](http://localhost:5173)**
* Upload a video
* Click **Process Video**
* Watch the scene graph come to life

**That's it!** 🎉

---

## 💡 What It Does

* **🎥 Extracts frames** from your uploaded video
* **🧠 Sends frames to Google Gemini** for multimodal reasoning
* **📊 Builds an interactive scene graph** showing:

  * objects
  * people
  * actions
  * relationships
* **💬 Generates detailed captions** for every frame
* **💾 Allows JSON export** of the final graph
* **🔐 Keeps you in control** — the frontend only talks to your local backend

---

## 🎮 How to Use

1. Upload any video (MP4 recommended)
2. Choose the frame extraction speed
3. Click **Analyze** to send frames to Gemini
4. Explore the interactive graph
5. Export the full graph as JSON
6. Reset whenever you want to process another video

---

## ⚙️ Requirements

| Item        | Requirement            |
| ----------- | ---------------------- |
| **Node.js** | v18+                   |
| **RAM**     | 2GB+ recommended       |
| **API Key** | Google Gemini required |
| **Browser** | Chrome / Firefox       |

---

## 🛠️ Commands

```bash
# Frontend
npm run dev

# Backend
npm run dev

# Install all dependencies
npm install

# Build frontend
npm run build
```

---

## 🐛 Common Issues

**API key errors?**
Make sure you pass your Gemini API key correctly through the UI.

**Long processing time?**
Large videos = many frames. Try lowering frame extraction rate.

**Empty graph?**
Ensure your video isn’t too dark or too fast-moving.

**CORS problems?**
Frontend and backend must run on different ports (5173 + 5000).

---

## 📋 What's Inside

* **Frontend (React + Vite)** — video upload UI, graph visualization
* **Backend (Node.js + Express)** — handles Gemini calls + prompt building
* **Frame Extraction Engine** — converts video to images
* **ForceGraph Renderer** — displays nodes, links, captions, and evolution
* **JSON Exporter** — saves your full scene graph

---

## 🔄 Updates

```bash
git pull origin main
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE).

