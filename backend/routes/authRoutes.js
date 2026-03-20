import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { getDB } from '../config/db.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        if (username === 'admin') {
            return res.status(400).json({ error: 'Username not allowed' });
        }
        const existing = await getDB().collection('users').findOne({ username });
        if (existing) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await getDB().collection('users').insertOne({
            username,
            passwordHash,
            role: 'employee',
            createdAt: new Date(),
        });
        const newUser = { username, role: 'employee' };
        req.logIn(newUser, (err) => {
            if (err) return res.status(500).json({ error: 'Login after register failed' });
            return res.status(201).json(newUser);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json({ username: user.username, role: user.role });
        });
    })(req, res, next);
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.json({ message: 'Logged out' });
    });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ username: req.user.username, role: req.user.role });
    }
    res.status(401).json({ error: 'Not authenticated' });
});

export default router;