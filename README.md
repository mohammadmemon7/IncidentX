# Incident X - Smart Incident Response Platform

Incident X is an AI-powered incident management platform built for hackathons. It provides real-time collaboration, automated incident detection, and AI-driven intelligence layers including root cause analysis and automated postmortems.

## 🚀 Core Features

- **Real-Time Collaboration**: Instant timeline updates and status changes across all active responders via WebSockets (Socket.io).
- **AI Intelligence Layer**: Powered by Google's Gemini 2.0 Flash. Features automated incident summaries, real-time root cause suggestions, and institutional memory-aware postmortem generation.
- **Auto-Detection Engine**: Secure API ingestion endpoint (`/api/ingest/logs`) that uses AI to analyze system logs, classify severity, and automatically declare incidents without human intervention.
- **Public Status Page**: Independent, unauthenticated view (`/status`) that polls the backend to display current operational health and active incident statuses.
- **Role-Based Access Control (RBAC)**: JWT-secured roles (`admin`, `responder`, `viewer`) dictating read/write capabilities across the platform.

## 🛠️ Technology Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS v4 (Glassmorphism design system)
- Redux Toolkit (RTK Query for state & caching)
- Socket.io Client (Real-time events)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Socket.io (Real-time broadcasts)
- `@google/generative-ai` (Gemini Integration)
- JWT & bcryptjs (Authentication)

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas URI)
- Gemini API Key

### 1. Environment Setup

**Backend (`server/.env`):**
```env
PORT=10001
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=supersecretjwtkey
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:10001/api
VITE_SOCKET_URL=http://localhost:10001
```

### 2. Installation & Seeding

**Server:**
```bash
cd server
npm install
node seed.js # Populates demo users and past incidents
npm run dev
```

**Client:**
```bash
cd client
npm install
npm run dev
```

### 3. Demo Credentials
If you ran the seed script successfully, use these to log in:
- **Admin**: `admin@demo.com` / `admin123`
- **Responder**: `responder@demo.com` / `responder123`
- **Viewer**: `viewer@demo.com` / `viewer123`

## 🗂️ Project Structure

- `client/src/components`: Reusable UI components (Modals, AI panels, Timeline).
- `client/src/store`: Redux slices and RTK Query endpoints.
- `server/routes`: Express API controllers.
- `server/services`: External integrations (e.g., `aiService.js` for Gemini logic).
- `server/models`: MongoDB Mongoose schemas.
