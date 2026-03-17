import productService from '../services/productService.js';

const getAll = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (err) {
        next(err);
    }
};

const getExpiring = async (req, res, next) => {
    try {
        const products = await productService.getExpiringProducts(
            parseInt(req.params.days)
        );
        res.json(products);
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await productService.updateProduct(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const sell = async (req, res, next) => {
    try {
        const { productId, quantitySold } = req.body;
        const result = await productService.sellProduct(productId, parseInt(quantitySold));
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export default { getAll, getById, getExpiring, create, update, remove, sell };