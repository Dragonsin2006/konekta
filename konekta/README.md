# Konekta React Client

This package hosts the React SPA that mirrors the original static Konekta UI while talking to the Express/Mongo backend located in `backend/server.js`. The app is built with Vite, Tailwind (via the CDN shim), and React Router.

## Prerequisites

- Node 18+ (or any version supported by Vite)
- The backend running locally on port `3001` (see root `server.js`)
- MongoDB running locally (the backend uses `mongodb://localhost:27017/konekta` by default)

## Environment variables

Copy the example file and adjust the API URL if needed:

```bash
cp env.example .env
```

`VITE_API_URL` should point to wherever `backend/server.js` is running (defaults to `http://localhost:3001`). The same `.env` file is also read by the backend, so you can optionally override:

- `MONGO_URI` – e.g. `mongodb://127.0.0.1:27017/konekta`
- `PORT` – defaults to `3001`

## Install dependencies

1. Install frontend dependencies (from `konekta/`):

   ```bash
   npm install
   ```

2. Install backend dependencies (from `konekta/backend/`):

   ```bash
   cd backend
   npm install
   ```

## Run the app

> Make sure MongoDB is running locally (for example `brew services start mongodb-community@7.0` on macOS or `mongod --config /usr/local/etc/mongod.conf`). If you use MongoDB Atlas, update `MONGO_URI` accordingly.

1. Start the backend (inside `konekta/backend/`):
   ```bash
   npm run dev   # or `npm start` for a one-off run
   ```
2. Start the Vite dev server (inside `konekta/`):
   ```bash
   npm run dev
   ```
3. Visit the URL printed by Vite (usually `http://localhost:5173`). The frontend proxies API requests to `VITE_API_URL`.

## Build for production

```bash
npm run build
```

The build artifacts land in `konekta/dist`.

## Lint

```bash
npm run lint
```

> **Note:** ESLint needs access to `node_modules`. If you run this command in a locked-down environment, ensure the process has read permissions to the dependency tree.
