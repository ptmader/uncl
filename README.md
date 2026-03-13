# UNCL - Daily Trivia Game

This is the Node.js/Express API backend for UNCL, powered by Supabase.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env.local`

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```bash
cp .env.example .env.local
```

Then edit `.env.local`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
NODE_ENV=development
```

### 3. Run Locally
```bash
npm run dev
```

The API will start at `http://localhost:3000`

### 4. Test the API
```bash
# Health check
curl http://localhost:3000/api/health

# Get today's puzzle
curl http://localhost:3000/api/puzzle/today
```

## API Endpoints

All endpoints start with: `https://uncl.fly.dev/api`

### Health
- `GET /health` — Health check

### Puzzles
- `GET /puzzle/today` — Get today's puzzle
- `POST /puzzle/submit` — Submit puzzle answers

### Groups
- `GET /groups` — List user's groups
- `POST /groups` — Create a new group
- `POST /groups/join` — Join group by code

### Leaderboards
- `GET /leaderboard/global?period=daily` — Global leaderboard

### Auth
- `POST /auth/signup` — Sign up with email/password

## Deployment to Fly.io

### 1. Set Secrets
```bash
flyctl secrets set \
  SUPABASE_URL="https://kzltgjmyegnbgfybkrys.supabase.co" \
  SUPABASE_ANON_KEY="your-anon-key" \
  SUPABASE_SERVICE_KEY="your-service-key"
```

### 2. Deploy
```bash
flyctl deploy
```

Your API will be live at `https://uncl.fly.dev`

## Project Structure
```
server/
├── index.js          — Main API server
└── routes/           — API route modules (future refactoring)
```

## Environment Variables

- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anonymous API key
- `SUPABASE_SERVICE_KEY` — Supabase service role key (for admin operations)
- `NODE_ENV` — 'development' or 'production'
- `PORT` — Port to run on (default: 3000 locally, 8080 on Fly.io)

## Database

This API connects to a PostgreSQL database managed by Supabase.

## Security

- Answer validation happens server-side, never on the client
- Environment variables with secrets are never committed to GitHub
- Row-level security (RLS) policies protect user data
