# InfoHub — ByteXL Coding Challenge

Single-page app (SPA) that integrates:
- Real-time Weather display
- Currency Converter (INR → USD/EUR)
- Motivational Quote Generator

Tech:
- Frontend: React (Vite), Axios
- Backend (local dev): Node.js + Express
- API Integration: Open-Meteo (no key), exchangerate.host (no key), Quotable (no key)
- Deployment: Vercel (serverless functions in `/api`) or local Express server

## Quick Start (Local Dev)

### 1) Backend (Express)
```bash
cd server
npm install
npm run dev
```
This starts the API on http://localhost:3001

### 2) Frontend (Vite React)
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
Vite dev server runs on http://localhost:5173 (by default). The `vite.config.js` proxies `/api` to `http://localhost:3001`.

## Build for Production (Frontend)
```bash
cd client
npm run build
npm run preview
```

## API Endpoints
- `GET /api/quote` → `{ content, author }`
- `GET /api/weather?location=Hyderabad` → `{ location, temperature, description }`
- `GET /api/currency?amount=100` → `{ usd, eur }` (values are the converted amounts from INR)

## Deployment (Vercel — single repo)
This repo includes `/api` serverless functions that mirror the Express endpoints. Easiest path:

1. Push this folder to a **public GitHub repo**.
2. Import the repo into **Vercel**.
3. Framework Preset: **Other** (or Vite/React). Vercel will detect the `/api` functions automatically.
4. Set **Root Directory** to the repo root (so both `/api` and `/client` are in scope).
5. In Vercel Project Settings → Build & Output:
   - Build Command: `npm --prefix client install && npm --prefix client run build`
   - Output Directory: `client/dist`
6. Add `vercel.json` from this repo (already provided) so that Vercel:
   - Builds the frontend from `/client`
   - Serves `/api/*` via serverless functions
   - Rewrites API calls from the built SPA to `/api/*`

After deploy, your app will be available at your Vercel domain, with working API routes.

> Alternative: Deploy the Express server to Render/Fly.io and set the frontend to call that backend via an environment variable. This project already works out-of-the-box with local proxy and serverless API on Vercel.

## Project Structure
```
InfoHub-Challenge/
├── api/                 # Vercel serverless functions (for easy deploy)
│   ├── currency.js
│   ├── quote.js
│   └── weather.js
├── client/              # React (Vite)
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── WeatherModule.jsx
│   │       ├── CurrencyConverter.jsx
│   │       └── QuoteGenerator.jsx
│   └── vite.config.js
├── server/              # Express backend (for local dev)
│   ├── package.json
│   └── server.js
└── vercel.json
```

## Notes
- Weather uses **Open‑Meteo** and its **geocoding API** (no key required). If geocoding fails, it falls back to Hyderabad, India.
- Currency uses **exchangerate.host** (no key) with `base=INR` and `symbols=USD,EUR`.
- Quotes use **Quotable**.
- Each module shows loading and error states.

Good luck and happy hacking! ✨
