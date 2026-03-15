import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connection.js';
import productRoutes from './routes/products.js';
import wasteReportRoutes from './routes/wasteReports.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


app.use(express.json());


app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.sendStatus(200);

    next();

});


app.use('/api/products', productRoutes);

app.use('/api/waste-reports', wasteReportRoutes);


connectDB().then(() => {

    app.listen(PORT, () => {

        console.log(`Server running on port ${PORT}`);

    });

});
