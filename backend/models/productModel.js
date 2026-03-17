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
        .find({
            batches: {
                $elemMatch: {
                    expiryDate: { $lte: future },
                    remainingQuantity: { $gt: 0 },
                },
            },
        })
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

// FIFO sell — deduct from earliest expiring batch first
const sellProduct = async (id, quantitySold) => {
    const product = await findById(id);
    if (!product) throw new Error('Product not found');

    // Sort batches by earliest expiry first (FIFO)
    const batches = [...product.batches].sort(
        (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
    );

    // Check total available stock
    const totalRemaining = batches.reduce((sum, b) => sum + (b.remainingQuantity || 0), 0);
    if (quantitySold > totalRemaining) {
        throw new Error(`Not enough stock. Only ${totalRemaining} units available.`);
    }

    // Deduct from batches FIFO
    let toDeduct = quantitySold;
    const updatedBatches = batches.map((b) => {
        if (toDeduct <= 0) return b;
        const deduct = Math.min(toDeduct, b.remainingQuantity || 0);
        toDeduct -= deduct;
        return { ...b, remainingQuantity: (b.remainingQuantity || 0) - deduct };
    });

    // Update in DB
    await getDB()
        .collection(COLLECTION)
        .updateOne(
            { _id: new ObjectId(id) },
            { $set: { batches: updatedBatches } }
        );

    return { message: `${quantitySold} units sold successfully` };
};

export default { findAll, findById, findExpiring, insertOne, updateOne, deleteOne, sellProduct };