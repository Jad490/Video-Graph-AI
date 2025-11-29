# VideoGraph AI

**Generate scene graphs from videos using AI** 🎥✨

Upload any video, extract frames, and transform them into interactive scene graphs! 
You can run the app locally or use our website 👉 [https://video-graph-ai.onrender.com](https://video-graph-ai.onrender.com)


![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-Ready-green.svg)


---

## ☁️ Quick Start (Render)

We deployed VideoGraph AI to the cloud using Render.  
You can try the app directly here:

- Live URL: https://video-graph-ai.onrender.com

> Note: On the first request Render may need a few seconds to spin up the service.

---

## 🐳 Quick Start with Docker

If you prefer not to install Node.js and dependencies locally, you can run VideoGraph AI with Docker.

### Option 1 – Docker Compose (recommended)

    # Clone this repo
    git clone https://github.com/Jad490/Video-Graph-AI.git
    cd Video-Graph-AI

    # Build and start the containers
    docker-compose up -d

    # View logs
    docker-compose logs -f

    # Stop the containers
    docker-compose down

### Option 2 – Docker CLI

    # Build the image
    docker build -t videograph-ai .

    # Run the container
    docker run -d \
      --name videograph-ai \
      -p 5173:5173 \
      -p 5001:5001 \
      videograph-ai

    # View logs
    docker logs -f videograph-ai

    # Stop and remove the container
    docker stop videograph-ai
    docker rm videograph-ai


## 🚀 Quick Start (Normal)

**1. Clone and start the app:**

```bash
git clone https://github.com/Jad490/Video-Graph-AI
cd Video-Graph-AI
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

### 🧠 Model Choice

We experimented with several vision-language models (LLaVA, Qwen, SmolVLM, etc.) during development, but we decided to stick with **Gemini** for caption generation, since it consistently produced much more accurate and temporally coherent captions on our CCTV robbery and non-robbery videos, while the other models were noticeably slower and less reliable in their descriptions.

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
2. Add your **Gemini API Key**
3. Click **Analyze** to send frames to Gemini
4. Explore the interactive graph and captions
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

## ⚖️ Model Comparison & Modifications

This project includes a direct comparison with our baseline model.

### 🔄 Modifications Made

* **Input Method Change:** The original model utilized a **live camera feed** for real-time captioning.  
* **Our Upgrade:** For this project, we modified the input method to handle **uploaded video files** instead. This allows for more flexible testing, forensic analysis of past footage, and consistent evaluation.

**Prompt Standardization (Fair Comparison):**  
The model's original prompt was very general:

To fairly compare our upgraded model with it, we also **replaced the generic prompt** with the **same structured prompt we used in our system**, so both models were evaluated under identical instructions.

### 📊 Evaluation Details

We performed a comparative benchmark testing both models on a dataset of **100 videos**, specifically analyzing the completeness and accuracy of detected events.

**Dataset & Methodology:**
* **Source:** The evaluation utilized a [Real-world CCTV Robbery Dataset](https://drive.google.com/drive/folders/1NNLH4OtwwrdARL5mtNr5XjDFhGeIiGsL).
* **Judge:** To ensure objectivity, we employed an independent **Third-Party LLM** to compare the generated Scene Graph JSONs against the ground truth of the video footage.


#### The Results

| Model | Accuracy | Performance Summary |
| :--- | :--- | :--- |
| **VideoGraph AI (Ours)** | **~88%** | Successfully captures key events, specific object attributes, and temporal actions. |
| **Original Baseline Model** | **~21%** | Frequently relies on generic schema, misses specific actions, and prone to hallucination. |

---

#### 📑 Independent Audit Report (Sample 10 Videos)

*While aggregate accuracy metrics were derived from the full 100-video dataset, we submitted a **random representative subset of 10 videos** to an independent third-party LLM for a detailed qualitative audit. This deep-dive analysis was conducted to objectively verify specific failure modes (e.g., hallucinations) and model behaviors without the subjectivity of manual review.*

* **Sample Data:** The raw outputs for 10 test cases (Videos 13 - 44 - 56 - 86 - 98 - 108 - 120 - 130 - 132 - 159) are available in this repository under the directories `/BASELINE - JSON` (Baseline) and `/OUR - JSON` (VideoGraph AI).
 
**1. Executive Summary**
The difference between the two models is stark and fundamental.

* **Model A (VideoGraph AI)** functions as a **Forensic Analyst**. It demonstrates a high level of "visual understanding." It successfully tracks temporal events (start to finish), identifies specific object attributes (colors, weapon types), and interprets complex human behaviors (crawling, tackling, surrendering).
* **Model B (Baseline)** functions as a **Generic Metadata Tagger**. It consistently fails to "see" the specific events of the video. It relies on high-level, abstract schema (e.g., "camera captures moment") and frequently hallucinates unrelated contexts, such as describing a violent robbery as a "reporter interviewing people."

### 2. Detailed Grading

| Metric | Model A (Ours) | Model B (Baseline) |
| :--- | :--- | :--- |
| **Object Detection** | **High** (Detected specific guns, clothing colors, cars, dogs) | **Fail** (Generic labels like "object," "shirt," "outfit") |
| **Action Recognition** | **High** (Detected "crawling," "vaulting," "struggling") | **Fail** (Generic verbs like "shows," "captures," "see") |
| **Context Awareness** | **High** (Distinguished Garage vs. Store vs. Salon) | **Fail** (Labeled Garage as Store; Robbery as Interview) |
| **Hallucination Rate** | **Low** (Minor entity splitting) | **Critical** (Invented reporters, books, and interviews) |
| **Final Score** | **86.5%** | **18%** |

**3. Verdict**
**Winner: VideoGraph AI is vastly superior.**

> "VideoGraph AI is production-ready for forensic robbery analysis. It provides actionable intelligence—if a suspect drives a 'Silver Hatchback' or wears a 'Yellow Shirt,' the model catches it. The Baseline model is currently unusable for this task due to severe training bias and a failure to analyze pixel-level activity."

*Disclaimer: The evaluation above is not subjective opinion; it was generated entirely by an independent LLM after analyzing the data from both models.*

---

## ☁️ How We Deployed the Application on Render

In this project, we used Render to handle deployment. Here's the sequence of steps we followed:

1. *Render Account Setup*: We started by creating a Render account to host our service.

2. *Connecting GitHub*: Next, we linked our Render account with our GitHub repository for seamless integration.

3. *Creating a New Service*: We then set up a new cloud service on Render that connects directly to our GitHub repo.

4. *Render Configuration*: We created a render.yaml file containing the necessary configuration details for the deployment.

5. *Deployment and URL*: Finally, we deployed the instance, and Render provided us with a live URL https://video-graph-ai.onrender.com


## 🔄 Updates

---

```bash
git pull origin main
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE).

