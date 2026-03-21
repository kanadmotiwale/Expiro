# Expiro

**Authors:** Aarya Patil & Kanad Motiwale

---

## Project Objective

Expiro is a store inventory and expiry tracker built for grocery store staff. Managers can monitor stock health, track expiring products, and review waste over time. Employees get a daily view of what needs to come off the shelf and can log waste reports on the spot.

The app is role-based. Managers and employees see different views and have different permissions.

---

## Screenshots

![WD Expiro Thumbnail 1](./Screenshots/WD%20Expiro%20Thumbnail%201.png)
![WD Expiro Thumbnail 2](./Screenshots/WD%20Expiro%20Thumbnail%202.png)

---

## Instructions to Build

### Prerequisites

- Node.js v18+
- A MongoDB Atlas account

### 1. Clone the repo

```bash
git clone https://github.com/kanadmotiwale/Expiro.git
cd Expiro
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
MONGO_URI=mongodb+srv://<username>:<password>@expiro.mongodb.net/expiro
PORT=5001
SESSION_SECRET=your_secret_here
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Seed the database

```bash
cd backend
npm run seed
```

This populates the database with 1,000+ synthetic product records across 13 grocery categories

---

## Live Demo

[https://expiro-three.vercel.app/](https://expiro-three.vercel.app/)

---

## License

MIT
