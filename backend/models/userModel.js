import { getDB } from '../config/db.js';

const COLLECTION = 'users';

const findByUsername = async (username) => {
    return await getDB().collection(COLLECTION).findOne({ username });
};

const createUser = async (username, passwordHash) => {
    const existing = await findByUsername(username);
    if (existing) throw new Error('Username already exists');
    const result = await getDB().collection(COLLECTION).insertOne({
        username,
        passwordHash,
        role: 'employee',
        createdAt: new Date(),
    });
    return { _id: result.insertedId, username, role: 'employee' };
};

export default { findByUsername, createUser };