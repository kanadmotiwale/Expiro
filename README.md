# Expiro — Store Inventory & Expiry Tracker

## Authors
- Aarya Patil
- Kanad Motiwale

## Class Link
[CS5610 Web Development — Northeastern University](#)

---

## Project Objective

Expiro is a role-based store inventory and expiry management web application. Managers log products and their expiry dates as stock comes in. Employees get a daily color-coded pull list showing exactly what needs to be removed from shelves. The app helps reduce waste, prevent expired products from reaching customers, and track stock levels.

---

## Screenshot

> *(Add screenshot here after deployment)*

---

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 18 with Hooks, Vite                     |
| Backend     | Node.js, Express                              |
| Database    | MongoDB Atlas (native driver)                 |
| Deployment  | Render (backend), GitHub Pages (frontend)     |

---

## Instructions to Build

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@expiro.mongodb.net/expiro
PORT=5000
```

Then run:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Seed Database

```bash
cd backend
npm run seed
```