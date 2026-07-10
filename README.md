# Marketkart — Flipkart-style E-commerce Clone

A full-stack e-commerce web app (React + Node.js/Express + MongoDB), containerized with Docker and ready to push to GitLab.

**Features:** product listing with search/pagination, a responsive filter sidebar (price range, brand, rating, sorting — collapses into a slide-in drawer on mobile), product detail page, wishlist (saved products), cart (persisted in browser), user register/login (JWT), checkout with address form, order history, a scrolling announcement bar, a live-countdown flash sale banner, and a "Deal of the Day" spotlight.

```
flipcart-clone/
├── backend/          Express API + MongoDB models
├── frontend/          React (Vite) app
├── docker-compose.yml
├── .gitlab-ci.yml
└── README.md
```

---

## 1. Prerequisites

Install these before you start:
- **Node.js** 18+ and npm — https://nodejs.org
- **MongoDB** (local install) OR just use Docker for it (recommended) — https://www.mongodb.com/try/download/community
- **Docker** and **Docker Compose** — https://docs.docker.com/get-docker/
- **Git** — https://git-scm.com/downloads
- A **GitLab** account — https://gitlab.com

Check your installs:
```bash
node -v
npm -v
docker -v
docker compose version
git --version
```

---

## 2. Run it locally (without Docker) — good for development

### 2.1 Start MongoDB
If you don't want to install MongoDB locally, just run it in Docker:
```bash
docker run -d --name mongo -p 27018:27017 mongo:7
```

### 2.2 Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run seed     # populates sample products into MongoDB
npm run dev       # starts the API on http://localhost:5000
```
Verify it's alive: open http://localhost:5000/api/health — should return `{"status":"ok"}`.

### 2.3 Frontend setup
Open a **new terminal**:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev       # starts React on http://localhost:5173
```
Open http://localhost:5173 in your browser. You should see the store, be able to browse products, register/login, add to cart, and place an order.

---

## 3. Run everything with Docker (recommended for a "production-like" run)

This spins up MongoDB, the Node API, and the React app (served by Nginx) together.

```bash
# from the project root (where docker-compose.yml lives)
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api/health
- MongoDB: exposed on localhost:27017 (for tools like Compass)

Seed sample products into the Dockerized database (run once, while containers are up):
```bash
docker compose exec backend npm run seed
```

Stop everything:
```bash
docker compose down
```

Stop and also wipe the database volume:
```bash
docker compose down -v
```

### Notes on the Docker setup
- `docker-compose.yml` builds `backend/Dockerfile` and `frontend/Dockerfile` and wires them together with an internal Docker network — containers reach each other by service name (`mongo`, `backend`, `frontend`).
- The frontend's Nginx config (`frontend/nginx.conf`) proxies `/api/*` requests to the backend container, so the browser only ever talks to port 8080.
- Set a real `JWT_SECRET` before deploying anywhere public:
  ```bash
  JWT_SECRET=$(openssl rand -hex 32) docker compose up --build -d
  ```

---
