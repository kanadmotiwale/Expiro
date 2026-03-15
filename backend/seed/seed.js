import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const client = new MongoClient(process.env.MONGO_URI);

const CATEGORIES = ['Dairy', 'Bakery', 'Meat', 'Produce', 'Frozen', 'Beverages', 'Snacks', 'Canned Goods'];
const SHELF_LOCATIONS = ['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4', 'Aisle 5', 'Freezer', 'Refrigerated'];
const REASONS = ['expired', 'damaged', 'other'];
const EMPLOYEES = ['Andre', 'Mandy', 'Carlos', 'Sara', 'John'];

const randomDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
};

const seed = async () => {
    try {
        await client.connect();
        const db = client.db('expiro');

        // Clear existing data
        await db.collection('products').deleteMany({});
        await db.collection('waste_reports').deleteMany({});
        await db.collection('users').deleteMany({});

        console.log('Cleared existing data...');

        // Seed users
        const users = [
            { name: 'Mike', email: 'mike@expiro.com', passwordHash: 'hashed_pw', role: 'manager', createdAt: new Date() },
            { name: 'Andre', email: 'andre@expiro.com', passwordHash: 'hashed_pw', role: 'employee', createdAt: new Date() },
            { name: 'Mandy', email: 'mandy@expiro.com', passwordHash: 'hashed_pw', role: 'employee', createdAt: new Date() },
        ];
        await db.collection('users').insertMany(users);
        console.log(`Seeded ${users.length} users...`);

        // Seed products (200 products with batches)
        const products = [];
        for (let i = 0; i < 200; i++) {
            const numBatches = faker.number.int({ min: 2, max: 5 });
            const batches = Array.from({ length: numBatches }, () => ({
                quantity: faker.number.int({ min: 5, max: 100 }),
                expiryDate: randomDate(faker.number.int({ min: -5, max: 30 })),
                receivedAt: randomDate(-faker.number.int({ min: 1, max: 30 })),
            }));

            products.push({
                name: faker.commerce.productName(),
                category: faker.helpers.arrayElement(CATEGORIES),
                shelfLocation: faker.helpers.arrayElement(SHELF_LOCATIONS),
                stockCount: faker.number.int({ min: 10, max: 200 }),
                batches,
                createdAt: new Date(),
            });
        }
        const insertedProducts = await db.collection('products').insertMany(products);
        console.log(`Seeded ${products.length} products...`);

        // Seed waste reports (800+ reports)
        const productIds = Object.values(insertedProducts.insertedIds);
        const wasteReports = [];
        for (let i = 0; i < 850; i++) {
            const productIndex = faker.number.int({ min: 0, max: productIds.length - 1 });
            wasteReports.push({
                productId: productIds[productIndex],
                productName: products[productIndex].name,
                quantityRemoved: faker.number.int({ min: 1, max: 20 }),
                reason: faker.helpers.arrayElement(REASONS),
                reportedBy: faker.helpers.arrayElement(EMPLOYEES),
                notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.4 }) || '',
                reportedAt: randomDate(-faker.number.int({ min: 0, max: 90 })),
            });
        }
        await db.collection('waste_reports').insertMany(wasteReports);
        console.log(`Seeded ${wasteReports.length} waste reports...`);

        console.log('✅ Seeding complete! Total records:', users.length + products.length + wasteReports.length);
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await client.close();
    }
};

seed();