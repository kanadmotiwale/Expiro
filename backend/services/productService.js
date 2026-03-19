import productModel from '../models/productModel.js';

const getAllProducts = async () => {
    return await productModel.findAll();
};

const getProductById = async (id) => {
    const product = await productModel.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
};

const getExpiringProducts = async (days) => {
    return await productModel.findExpiring(days);
};

const createProduct = async ({ name, category, shelfLocation, stockCount, batches }) => {
    const newProduct = {
        name,
        category,
        shelfLocation,
        stockCount: stockCount || 0,
        batches: batches || [],
        createdAt: new Date(),
    };
    const result = await productModel.insertOne(newProduct);
    return { _id: result.insertedId, ...newProduct };
};

const updateProduct = async (id, updates) => {
    const { _id, ...safeUpdates } = updates;
    const result = await productModel.updateOne(id, safeUpdates);
    if (result.matchedCount === 0) throw new Error('Product not found');
    return { message: 'Product updated' };
};

const deleteProduct = async (id) => {
    const result = await productModel.deleteOne(id);
    if (result.deletedCount === 0) throw new Error('Product not found');
    return { message: 'Product deleted' };
};

const sellProduct = async (id, quantitySold) => {
    if (!quantitySold || quantitySold <= 0) throw new Error('Quantity sold must be greater than 0');
    return await productModel.sellProduct(id, quantitySold);
};

export default {
    getAllProducts,
    getProductById,
    getExpiringProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    sellProduct,
};