# Movie Rating System (MERN)

A full-stack movie rating app with JWT auth, movie browsing, reviews, watchlists, recommendations, analytics, trending movies, helpful review likes, comparison, and an admin movie manager.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Recharts, Lucide React
- Backend: Node.js, Express.js, JWT, bcrypt, Mongoose
- Database: MongoDB Atlas or local MongoDB
- Optional integrations: TMDb API, OMDb API, Socket.IO

## Quick Start

```bash
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run seed
npm run dev:server
npm run dev:client
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5001`

Run the frontend and backend commands in separate terminals.

## Demo Accounts After Seeding

- Admin: `admin@moviebox.test` / `Password123!`
- User: `maya@moviebox.test` / `Password123!`

## Project Structure

```text
client/   React app
server/   Express API, MongoDB models, routes, controllers
```

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/movies`
- `GET /api/movies/trending`
- `GET /api/movies/recommendations`
- `GET /api/movies/:id`
- `POST /api/movies` admin only
- `PUT /api/movies/:id` admin only
- `DELETE /api/movies/:id` admin only
- `POST /api/reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`
- `POST /api/reviews/:id/like`
- `GET /api/watchlist`
- `POST /api/watchlist/:movieId`
- `PATCH /api/watchlist/:movieId`
- `DELETE /api/watchlist/:movieId`
- `GET /api/analytics/summary`
