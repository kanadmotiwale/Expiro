import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import userModel from './db.js';
import { getDB } from './db.js';

const initPassport = () => {
    passport.use(
        new LocalStrategy(
            { usernameField: 'username', passwordField: 'password' },
            async (username, password, done) => {
                try {
                    // Manager hardcoded credentials
                    if (username === 'admin' && password === 'admin') {
                        return done(null, { username: 'admin', role: 'manager' });
                    }

                    // Employee — check DB
                    const user = await getDB().collection('users').findOne({ username });
                    if (!user) return done(null, false, { message: 'User not found' });

                    const match = await bcrypt.compare(password, user.passwordHash);
                    if (!match) return done(null, false, { message: 'Incorrect password' });

                    return done(null, { username: user.username, role: user.role });
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser((str, done) => {
        done(null, JSON.parse(str));
    });
};

export default initPassport;