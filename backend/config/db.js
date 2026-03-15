import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db('expiro');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) throw new Error('Database not connected');
    return db;
};

export { connectDB, getDB };