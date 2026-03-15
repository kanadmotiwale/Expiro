import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

const COLLECTION = 'products';

const findAll = async () => {
    return await getDB().collection(COLLECTION).find().toArray();
};

const findById = async (id) => {
    return await getDB()
        .collection(COLLECTION)
        .findOne({ _id: new ObjectId(id) });
};

const findExpiring = async (days) => {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);
    return await getDB()
        .collection(COLLECTION)
        .find({ 'batches.expiryDate': { $lte: future } })
        .toArray();
};

const insertOne = async (product) => {
    return await getDB().collection(COLLECTION).insertOne(product);
};

const updateOne = async (id, updates) => {
    return await getDB()
        .collection(COLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: updates });
};

const deleteOne = async (id) => {
    return await getDB()
        .collection(COLLECTION)
        .deleteOne({ _id: new ObjectId(id) });
};

export default { findAll, findById, findExpiring, insertOne, updateOne, deleteOne };