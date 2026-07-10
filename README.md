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
docker run -d --name mongo -p 27017:27017 mongo:7
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

## 4. Push the project to GitLab

### 4.1 Create the repo on GitLab
1. Log into GitLab → click **New project** → **Create blank project**.
2. Name it (e.g. `flipcart-clone`), choose visibility, **do not** initialize with a README (you already have one).
3. Click **Create project** and copy the repository URL shown (HTTPS or SSH).

### 4.2 Initialize Git locally and push
From the project root (`flipcart-clone/`):
```bash
git init
git add .
git commit -m "Initial commit: Flipkart-style e-commerce app with Docker setup"

# Rename default branch to main (skip if already main)
git branch -M main

# Point to your GitLab repo (use the URL GitLab gave you)
git remote add origin https://gitlab.com/<your-username>/flipcart-clone.git

git push -u origin main
```
If you use SSH keys instead of HTTPS:
```bash
git remote add origin git@gitlab.com:<your-username>/flipcart-clone.git
git push -u origin main
```

### 4.3 Everyday workflow after the first push
```bash
git add .
git commit -m "Describe your change"
git push
```

### 4.4 Optional: CI/CD to auto-build Docker images
This repo includes a `.gitlab-ci.yml` that builds and pushes `backend` and `frontend` images to your project's **GitLab Container Registry** on every push to `main`. It works out of the box on GitLab.com using the built-in `CI_REGISTRY_*` variables — no extra setup needed beyond having CI/CD enabled on the project (**Settings → General → Visibility, project features, permissions**).

To pull a built image later:
```bash
docker pull registry.gitlab.com/<your-username>/flipcart-clone/backend:<commit-sha>
```

---

## 5. Environment variables reference

**backend/.env**
| Variable | Description | Example |
|---|---|---|
| `PORT` | API port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/flipcart` |
| `JWT_SECRET` | Secret used to sign auth tokens | long random string |
| `CLIENT_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

**frontend/.env**
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL the React app calls | `http://localhost:5000/api` |

---

## 6. API endpoints (quick reference)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | No | List products (`?search=&category=&brand=&minPrice=&maxPrice=&minRating=&sort=&page=&limit=`) |
| GET | `/api/products/categories` | No | Distinct category list |
| GET | `/api/products/brands` | No | Distinct brand list |
| GET | `/api/products/:id` | No | Single product |
| POST | `/api/auth/register` | No | Create account, returns JWT |
| POST | `/api/auth/login` | No | Log in, returns JWT |
| GET | `/api/auth/me` | Yes | Current user profile |
| POST | `/api/orders` | Yes | Place an order |
| GET | `/api/orders/mine` | Yes | List my orders |

Send the JWT as `Authorization: Bearer <token>` for protected routes.

---

## 7. Troubleshooting

- **"MongoDB connection failed"** — make sure Mongo is running (`docker run -d --name mongo -p 27017:27017 mongo:7`) and `MONGO_URI` in `backend/.env` matches (`mongodb://localhost:27017/flipcart` for local, `mongodb://mongo:27017/flipcart` inside Docker Compose).
- **Frontend can't reach API / CORS errors** — check `VITE_API_URL` in `frontend/.env` and `CLIENT_ORIGIN` in `backend/.env` match how you're running things.
- **Port already in use** — another process is using 5000/5173/8080/27017; stop it or change the port mapping in `docker-compose.yml`.
- **Empty product grid** — you haven't run the seed script yet (`npm run seed` locally, or `docker compose exec backend npm run seed` in Docker).

---

## 8. Next steps you could add
- Admin dashboard to manage products (CRUD UI + protected admin routes)
- Real payment gateway (Razorpay/Stripe) instead of Cash on Delivery
- Product reviews and ratings submission
- Image upload (S3/Cloudinary) instead of hotlinked images
- Server-side pagination cursor for large catalogs, Redis caching
