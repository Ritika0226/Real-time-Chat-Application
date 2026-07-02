# Real-Time Chat App

A full-stack real-time messaging application built with Express, Socket.IO, MongoDB, and Clerk for authentication.

## ✨ Features

- 🔐 User authentication & management via **Clerk**
- 💬 Real-time messaging with **Socket.IO**
- 🗄️ Persistent chat history stored in **MongoDB**
- 🔄 Automatic user sync via Clerk **webhooks** (create/update/delete)
- ⏰ Scheduled background jobs via **cron**
- 🌐 CORS-enabled API for frontend integration
- 📦 Production-ready static file serving

## 🛠️ Tech Stack

**Backend**
- Node.js + Express
- Socket.IO (real-time communication)
- MongoDB + Mongoose
- Clerk (`@clerk/express`, `@clerk/backend`) for auth & webhooks
- Svix (webhook signature verification, via Clerk)
- node-cron (scheduled jobs)

**Frontend**
- *(add your frontend stack here — e.g. React + Vite)*

## 📁 Project Structure

```
├── lib/
│   ├── db.js              # MongoDB connection
│   ├── socket.js           # Socket.IO server setup
│   └── cron.js             # Scheduled jobs
├── models/
│   └── user.model.js       # User schema
├── routes/
│   ├── auth.route.js       # Auth routes
│   └── message.route.js    # Messaging routes
├── webhooks/
│   └── clerk.webhook.js    # Clerk webhook handler
├── public/                 # Production build (served statically)
├── index.js                 # App entry point
└── .env                     # Environment variables
```

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Frontend
FRONTEND_URL=http://localhost:5173

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_signing_secret
```

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env` and fill in your values (see above).

### 4. Run the development server
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or whatever `PORT` is set to).

### 5. Verify it's running
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{ "ok": true }
```

## 🔗 Clerk Webhook Setup

This app listens for Clerk user events at:

```
POST /api/webhooks/clerk
```

To connect Clerk to your local server during development:

1. Expose your local server using [ngrok](https://ngrok.com):
   ```bash
   ngrok http 5000
   ```
2. In the **Clerk Dashboard** → **Webhooks**, add an endpoint:
   ```
   https://<your-ngrok-subdomain>.ngrok-free.app/api/webhooks/clerk
   ```
3. Subscribe to the events you need, e.g.:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the generated **Signing Secret** into your `.env` as `CLERK_WEBHOOK_SIGNING_SECRET`.

> ⚠️ Note: Free ngrok URLs change on every restart. Update the Clerk endpoint URL each time you restart ngrok during local development.

## 📡 API Endpoints

| Method | Endpoint                | Description                     |
|--------|--------------------------|----------------------------------|
| GET    | `/health`                | Health check                    |
| POST   | `/api/webhooks/clerk`    | Clerk webhook receiver          |
| *      | `/api/auth/*`            | Authentication routes           |
| *      | `/api/messages/*`        | Messaging routes                |

## 🧵 Real-Time Communication

Socket.IO is initialized in `lib/socket.js` and shares the same HTTP server instance as Express, enabling real-time bi-directional communication for messaging features.

## 📦 Production Build

If a `public/` directory exists (e.g. from a frontend build), the server automatically serves it as static files and falls back to `index.html` for client-side routing.

## 📝 License

*(Add your license here, e.g. MIT)*