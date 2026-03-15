export const validateProduct = (req, res, next) => {
    const { name, category, shelfLocation } = req.body;
    if (!name || !category || !shelfLocation) {
        return res.status(400).json({ error: 'name, category and shelfLocation are required' });
    }
    next();
};

export const validateWasteReport = (req, res, next) => {
    const { productId, productName, quantityRemoved, reason } = req.body;
    if (!productId || !productName || !quantityRemoved || !reason) {
        return res.status(400).json({ error: 'productId, productName, quantityRemoved and reason are required' });
    }
    next();
};