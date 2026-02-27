# Books Database

A full-stack web application for browsing a curated collection of books. Built with a React frontend and a Node.js/Express backend backed by PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Containerization | Docker, Docker Compose |

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- npm >= 10.0.0
- [Docker](https://www.docker.com/) (for containerized setup)

---

## Getting Started

### Docker (Recommended)

The easiest way to run the full stack is with Docker Compose. This starts the React client, Express server, and a PostgreSQL database together.

**Start all services:**

```sh
npm run docker:start
```

**App URLs:**
- Client: http://localhost:3000
- Server: http://localhost:5001
- PostgreSQL: `localhost:5432` — user: `books`, password: `books`, db: `booksdb`

**Stop services:**

```sh
npm run docker:stop
```

**Tear down (including volumes):**

```sh
npm run docker:down
```

---

### Local Development

Run the server and client independently without Docker.

#### Server

```sh
cd server
npm install
npm test
npm start
```

The server runs on http://localhost:5000.

#### Client

```sh
cd client
npm install
npm test
npm start
```

The client runs on http://localhost:3000.

---

## Docker Dev Mode (Hot Reload)

Run the full stack with file watching enabled so code changes apply automatically — no container rebuilds needed.

```sh
npm run docker:dev:start
```

This enables:
- **Client** — React fast refresh via `react-scripts`
- **Server** — automatic restart via `nodemon`

**Stop dev mode:**

```sh
npm run docker:dev:down
```

**Stream logs:**

```sh
npm run docker:logs
```

---

## Database Seeding

On startup, the server automatically creates the `books` table and seeds it from `server/db/seeds/books.json` if the table is empty.

To disable auto-seeding, set the environment variable:

```
BOOKS_AUTO_SEED=false
```

To seed manually:

```sh
cd server
npm run db:seed
```

---

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/books/:id` | Fetch a book by ID |
