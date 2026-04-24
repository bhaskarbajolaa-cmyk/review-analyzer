# ✨ Review Insight Engine

A full-stack, AI-powered application that extracts deep insights from customer feedback. It analyzes either single text reviews or bulk CSV files to instantly generate sentiment scores, detect key entities, and summarize pros and cons.

## 🏗️ Architecture & Tech Stack

This project uses a modern decoupled architecture, combining a React frontend, a Java backend, and a low-code AI pipeline:

* **Frontend:** Next.js (React), Tailwind CSS, TypeScript
* **Backend:** Java (Spring Boot), Maven
* **AI Pipeline:** n8n (Node-based workflow automation)

---

## 📂 Folder Structure

This repository is organized as a monorepo containing three main parts:

```text
review-analyzer-app/
 ├── frontend/veiwstats/     # Next.js Frontend Application
 ├── backend/review_analyze/ # Spring Boot Backend Application
 └── n8n-workflow/           # Exported n8n workflow configuration
```

---

## ⚡ Quick Start (TL;DR)

If you already have Node.js, Java 23, and n8n installed, here is the fastest way to spin up the project:

1. **Import AI Pipeline:** Import the `.json` file from `/n8n-workflow` into n8n and toggle it to **Active**.
2. **Start Backend (Terminal 1):**
   ```bash
   cd backend/review_analyze
   ./mvnw spring-boot:run
   ```
3. **Start Frontend (Terminal 2):**
   ```bash
   cd frontend/veiwstats
   npm install && npm run dev
   ```
4. **Launch:** Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Detailed Setup Guide

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
* **Node.js** (v18 or higher) & npm
* **Java** (JDK 23 or compatible)
* **Maven** (If not using an IDE's built-in wrapper)
* **n8n** (Running locally or via cloud)

### Step 1: Set up the n8n AI Pipeline
Because the AI logic lives in n8n, you need to import the workflow first.
1. Open your n8n instance.
2. Create a new workflow, click the **Menu** in the top right, and select **Import from File**.
3. Select the `.json` file located in the `n8n-workflow/` folder of this repository.
4. **Important:** Double-click the "Respond to Webhook" nodes and ensure "Respond With" is set to **First Item**.
5. Toggle the workflow to **Active** (Production mode) so it listens on `http://localhost:5678/webhook/...`

### Step 2: Start the Spring Boot Backend
The backend acts as a bridge between the frontend and the n8n webhook, handling file uploads and JSON mapping.
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend/review_analyze
   ```
2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(The backend will start on `http://localhost:8080`)*

### Step 3: Start the Next.js Frontend
The frontend features a responsive, glassmorphism UI with a built-in proxy to bypass CORS restrictions.
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend/veiwstats
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *(The frontend will start on `http://localhost:3000`)*

---

## 🎮 Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. **For Deep Text Analysis:** Paste a single review into the text box and click "Generate Report". The app will return a detailed breakdown including readability score, writing style, and sentiment distribution.
3. **For Bulk CSV Analysis:** Drag and drop a `.csv` file containing multiple reviews into the drop zone. The app will prioritize the file, aggregate the data, and return an executive summary.
