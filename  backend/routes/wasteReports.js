import { Router } from 'express';

import { ObjectId } from 'mongodb';

import { getDB } from '../db/connection.js';

const router = Router();

// GET all waste reports

router.get('/', async (req, res) => {

    try {

        const reports = await getDB()

            .collection('waste_reports')

            .find()

            .toArray();

        res.json(reports);

    } catch (err) {

        res.status(500).json({ error: 'Failed to fetch waste reports' });

    }

});

// GET single waste report

router.get('/:id', async (req, res) => {

    try {

        const report = await getDB()

            .collection('waste_reports')

            .findOne({ _id: new ObjectId(req.params.id) });

        if (!report) return res.status(404).json({ error: 'Waste report not found' });

        res.json(report);

    } catch (err) {

        res.status(500).json({ error: 'Failed to fetch waste report' });

    }

});

// POST create waste report

router.post('/', async (req, res) => {

    try {

        const { productId, productName, quantityRemoved, reason, reportedBy, notes } = req.body;

        const newReport = {

            productId: new ObjectId(productId),

            productName,

            quantityRemoved,

            reason,

            reportedBy,

            notes: notes || '',

            reportedAt: new Date(),

        };

        const result = await getDB()

            .collection('waste_reports')

            .insertOne(newReport);

        res.status(201).json({ _id: result.insertedId, ...newReport });

    } catch (err) {

        res.status(500).json({ error: 'Failed to create waste report' });

    }

});

// PUT update waste report

router.put('/:id', async (req, res) => {

    try {

        const { productName, quantityRemoved, reason, notes } = req.body;

        const result = await getDB()

            .collection('waste_reports')

            .updateOne(

                { _id: new ObjectId(req.params.id) },

                { $set: { productName, quantityRemoved, reason, notes } }

            );

        if (result.matchedCount === 0)

            return res.status(404).json({ error: 'Waste report not found' });

        res.json({ message: 'Waste report updated' });

    } catch (err) {

        res.status(500).json({ error: 'Failed to update waste report' });

    }

});

// DELETE waste report

router.delete('/:id', async (req, res) => {

    try {

        const result = await getDB()

            .collection('waste_reports')

            .deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0)

            return res.status(404).json({ error: 'Waste report not found' });

        res.json({ message: 'Waste report deleted' });

    } catch (err) {

        res.status(500).json({ error: 'Failed to delete waste report' });

    }

});

export default router;
