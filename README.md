# Smart Tour Crowd Guide (MVP)

This project is a starter implementation for a tourism app that:

- Tracks crowd count at popular sites from ESP32 + ultrasonic gate sensors.
- Recommends less crowded nearby spots.
- Provides nearby hospitals, police stations, and essentials.
- Includes admin login and dashboard for site authorities.
- Stores sensor history in PostgreSQL and exposes hourly trend analytics.
- Includes Flutter Android app client using the same APIs.

## Architecture

- `backend/`: Node.js + Express API
  - Receives gate crossing events from ESP32
  - Maintains live crowd count per site
  - Recommends low-crowd sites
  - Fetches nearby public services via OpenStreetMap Overpass API
  - Admin login with JWT authentication
  - PostgreSQL sensor event persistence + hourly trends endpoint
- `app/`: Tourist web app UI
  - Shows live crowd per site
  - Recommends less-crowded places
  - Lists nearby hospitals, police, and essentials
  - Displays user and nearby services on a map
- `admin/`: Site authority dashboard
  - Login page
  - Occupancy cards and hourly net flow chart
  - Protected access via backend token
- `esp32/`: Arduino firmware for ESP32 with two ultrasonic sensors
  - Detects crossing direction (`in` / `out`)
  - Sends events to backend over HTTP
- `mobile_flutter/`: Flutter Android app
  - Live crowd, recommendations, nearby services, and map

## Quick Start

### 1) Backend setup

```bash
cd backend
npm install
npm run dev
```

Backend default URL: `http://localhost:4000`

### 1.1) Configure environment

Copy `.env.example` to `.env` and set values.

- `JWT_SECRET`: Strong random secret
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password
- `DATABASE_URL`: PostgreSQL connection string

### 1.1) Open the app

After backend starts, open this URL in your browser:

```text
http://localhost:4000
```

The backend serves the app from `app/` automatically.

### 1.2) Open admin dashboard

```text
http://localhost:4000/admin
```

Login with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from your `.env`.

### 2) Test API

- Health: `GET /health`
- Sites: `GET /api/sites`
- Recommendations: `GET /api/recommendations?lat=11.02&lng=76.97&limit=3`
- Nearby hospitals: `GET /api/nearby?lat=11.02&lng=76.97&type=hospital&radius=3000`
- Admin login: `POST /api/admin/login`
- Admin sites: `GET /api/admin/sites` (Bearer token)
- Admin trends: `GET /api/admin/trends/:siteId?hours=24` (Bearer token)

### 2.1) App features checklist

- Live site crowd cards from `/api/sites`
- Less-crowded recommendations from `/api/recommendations`
- Nearby hospitals/police/essentials from `/api/nearby`
- Geolocation-based local search
- Map markers for nearby services

### 3) ESP32 setup

Open `esp32/gate_counter/gate_counter.ino` in Arduino IDE and update:

- `WIFI_SSID`
- `WIFI_PASSWORD`
- `BACKEND_URL`
- `SITE_ID` and `GATE_ID`

Then upload to your ESP32.

## How counting works (gate)

Two ultrasonic sensors are placed along the walking direction:

- If sensor A triggers first, then sensor B -> person entering (`in`)
- If sensor B triggers first, then sensor A -> person exiting (`out`)

Each event updates live site occupancy in backend.

## Notes for production

- Replace in-memory store with PostgreSQL.
- Add authentication between ESP32 and backend.
- Add retries/queueing for offline sensor devices.
- Add map UI in mobile app (Flutter/React Native).
- Use Places APIs (Google, Mapbox, or OSM stack) for richer POI data.

## PostgreSQL quick setup

1. Install PostgreSQL.
2. Create database `tourpulse`.
3. Set `DATABASE_URL` in `.env`.
4. Start backend. It auto-creates `sensor_events` table.

## Flutter mobile app

```bash
cd mobile_flutter
flutter pub get
flutter run
```

Android emulator uses backend URL `http://10.0.2.2:4000` in `lib/main.dart`.

## Deploy Online

### Option A: Render (Recommended)

This repository includes `render.yaml` for one-click deployment.

1. Push this project to GitHub.
2. In Render, click New -> Blueprint.
3. Select your GitHub repo.
4. Render reads `render.yaml` and creates the web service.
5. Set these required env values in Render dashboard:
  - `ADMIN_PASSWORD`
  - `DATABASE_URL` (optional, but required for trend persistence)
  - `GOOGLE_MAPS_API_KEY` (required for address name from live location)
  - `TWILIO_ACCOUNT_SID` (required for SMS OTP)
  - `TWILIO_AUTH_TOKEN` (required for SMS OTP)
  - `TWILIO_VERIFY_SERVICE_SID` (required for SMS OTP)
6. Deploy and open your Render service URL.

Public URLs after deploy:

- Tourist app: `https://<your-service>.onrender.com/`
- Location step: `https://<your-service>.onrender.com/location.html`
- Guide: `https://<your-service>.onrender.com/guide.html`
- Admin: `https://<your-service>.onrender.com/admin`

### Option B: Docker platforms (Railway/Fly/VM)

Build image from repository root:

```bash
docker build -f backend/Dockerfile -t tour-pulse-guide .
docker run -p 4000:4000 --env-file backend/.env tour-pulse-guide
```

Then map your platform domain to container port `4000`.
