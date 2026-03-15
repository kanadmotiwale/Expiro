const requireRole = (role) => (req, res, next) => {
    const userRole = req.headers['x-role'];
    if (!userRole) return res.status(401).json({ error: 'No role provided' });
    if (userRole !== role)
        return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    next();
};

export default requireRole;