import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const client = new MongoClient(process.env.MONGO_URI);

const SHELF_LOCATIONS = ['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4', 'Aisle 5', 'Freezer', 'Refrigerated', 'Shelf A', 'Shelf B'];
const REASONS = ['expired', 'damaged', 'other'];
const EMPLOYEES = ['Andre', 'Mandy', 'Carlos', 'Sara', 'John'];

const randomDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
};

const PRODUCTS = [
    // Produce
    { name: 'Broccoli', category: 'Produce', brand: null, price: 1.99 },
    { name: 'Spinach', category: 'Produce', brand: null, price: 2.49 },
    { name: 'Romaine Lettuce', category: 'Produce', brand: null, price: 1.79 },
    { name: 'Cucumber', category: 'Produce', brand: null, price: 0.99 },
    { name: 'Red Bell Peppers', category: 'Produce', brand: null, price: 1.49 },
    { name: 'Carrots', category: 'Produce', brand: null, price: 1.29 },
    { name: 'Garlic', category: 'Produce', brand: null, price: 0.79 },
    { name: 'Ginger Root', category: 'Produce', brand: null, price: 0.99 },
    { name: 'Tomatoes', category: 'Produce', brand: null, price: 1.99 },
    { name: 'Zucchini', category: 'Produce', brand: null, price: 1.49 },
    { name: 'Sweet Potatoes', category: 'Produce', brand: null, price: 1.89 },
    { name: 'Kale', category: 'Produce', brand: null, price: 2.29 },
    { name: 'Celery', category: 'Produce', brand: null, price: 1.59 },
    { name: 'Mushrooms', category: 'Produce', brand: null, price: 2.49 },
    { name: 'Yellow Onions', category: 'Produce', brand: null, price: 1.19 },

    // Fruits
    { name: 'Gala Apples', category: 'Fruits', brand: null, price: 3.99 },
    { name: 'Bananas', category: 'Fruits', brand: null, price: 1.29 },
    { name: 'Navel Oranges', category: 'Fruits', brand: null, price: 3.49 },
    { name: 'Strawberries', category: 'Fruits', brand: null, price: 3.99 },
    { name: 'Blueberries', category: 'Fruits', brand: null, price: 4.49 },
    { name: 'Red Grapes', category: 'Fruits', brand: null, price: 3.29 },
    { name: 'Mangoes', category: 'Fruits', brand: null, price: 1.49 },
    { name: 'Pineapple', category: 'Fruits', brand: null, price: 2.99 },
    { name: 'Watermelon', category: 'Fruits', brand: null, price: 5.99 },
    { name: 'Peaches', category: 'Fruits', brand: null, price: 2.49 },
    { name: 'Lemons', category: 'Fruits', brand: null, price: 1.99 },
    { name: 'Raspberries', category: 'Fruits', brand: null, price: 3.99 },

    // Dairy
    { name: 'Whole Milk (1 Gallon)', category: 'Dairy', brand: 'Horizon Organic', price: 5.49 },
    { name: 'Almond Milk', category: 'Dairy', brand: 'Silk', price: 3.99 },
    { name: 'Greek Yogurt', category: 'Dairy', brand: 'Chobani', price: 5.99 },
    { name: 'Cheddar Cheese', category: 'Dairy', brand: 'Tillamook', price: 6.49 },
    { name: 'Unsalted Butter', category: 'Dairy', brand: 'Land O Lakes', price: 4.99 },
    { name: 'Sour Cream', category: 'Dairy', brand: 'Daisy', price: 2.99 },
    { name: 'Cream Cheese', category: 'Dairy', brand: 'Philadelphia', price: 3.49 },
    { name: 'Mozzarella Cheese', category: 'Dairy', brand: 'Kraft', price: 4.99 },
    { name: 'Oat Milk', category: 'Dairy', brand: 'Oatly', price: 4.49 },
    { name: 'Cottage Cheese', category: 'Dairy', brand: 'Breakstone', price: 3.29 },

    // Bakery
    { name: 'White Sandwich Bread', category: 'Bakery', brand: 'Wonder', price: 3.49 },
    { name: 'Whole Wheat Bread', category: 'Bakery', brand: 'Dave\'s Killer Bread', price: 5.99 },
    { name: 'Croissants (4 pack)', category: 'Bakery', brand: null, price: 4.99 },
    { name: 'Plain Bagels (6 pack)', category: 'Bakery', brand: 'Thomas\'', price: 3.99 },
    { name: 'Blueberry Muffins', category: 'Bakery', brand: null, price: 4.49 },
    { name: 'Sourdough Bread', category: 'Bakery', brand: null, price: 4.99 },
    { name: 'Dinner Rolls (12 pack)', category: 'Bakery', brand: null, price: 3.49 },
    { name: 'Cinnamon Raisin Bread', category: 'Bakery', brand: 'Pepperidge Farm', price: 4.29 },

    // Pasta & Grains
    { name: 'Spaghetti', category: 'Pasta & Grains', brand: 'Barilla', price: 1.99 },
    { name: 'Penne Pasta', category: 'Pasta & Grains', brand: 'Barilla', price: 1.99 },
    { name: 'Brown Rice (2lb)', category: 'Pasta & Grains', brand: 'Uncle Ben\'s', price: 3.49 },
    { name: 'White Rice (5lb)', category: 'Pasta & Grains', brand: 'Jasmine', price: 6.99 },
    { name: 'Quinoa', category: 'Pasta & Grains', brand: 'Ancient Harvest', price: 5.99 },
    { name: 'Fettuccine', category: 'Pasta & Grains', brand: 'Barilla', price: 1.99 },
    { name: 'Rotini Pasta', category: 'Pasta & Grains', brand: 'Mueller\'s', price: 1.79 },
    { name: 'Couscous', category: 'Pasta & Grains', brand: 'Near East', price: 2.49 },

    // Frozen Foods
    { name: 'Frozen Cheese Pizza', category: 'Frozen Foods', brand: 'DiGiorno', price: 7.99 },
    { name: 'Frozen Peas (16oz)', category: 'Frozen Foods', brand: 'Bird\'s Eye', price: 2.49 },
    { name: 'Frozen French Fries', category: 'Frozen Foods', brand: 'Ore-Ida', price: 4.99 },
    { name: 'Frozen Chicken Nuggets', category: 'Frozen Foods', brand: 'Tyson', price: 8.99 },
    { name: 'Frozen Mixed Vegetables', category: 'Frozen Foods', brand: 'Bird\'s Eye', price: 2.99 },
    { name: 'Frozen Waffles (8 pack)', category: 'Frozen Foods', brand: 'Eggo', price: 3.99 },
    { name: 'Frozen Burritos', category: 'Frozen Foods', brand: 'Amy\'s', price: 5.49 },
    { name: 'Ice Cream (Vanilla)', category: 'Frozen Foods', brand: 'Breyers', price: 5.99 },
    { name: 'Frozen Edamame', category: 'Frozen Foods', brand: 'Seapoint Farms', price: 3.49 },

    // Snacks
    { name: 'Classic Potato Chips', category: 'Snacks', brand: 'Lay\'s', price: 4.49 },
    { name: 'Tortilla Chips', category: 'Snacks', brand: 'Tostitos', price: 4.99 },
    { name: 'Pretzels', category: 'Snacks', brand: 'Rold Gold', price: 3.49 },
    { name: 'Microwave Popcorn', category: 'Snacks', brand: 'Orville Redenbacher', price: 3.99 },
    { name: 'Granola Bars (6 pack)', category: 'Snacks', brand: 'Nature Valley', price: 4.29 },
    { name: 'Cheez-It Crackers', category: 'Snacks', brand: 'Cheez-It', price: 4.49 },
    { name: 'Trail Mix', category: 'Snacks', brand: 'Planters', price: 5.99 },
    { name: 'Doritos Nacho Cheese', category: 'Snacks', brand: 'Doritos', price: 4.49 },
    { name: 'Rice Cakes', category: 'Snacks', brand: 'Quaker', price: 3.29 },

    // Chocolates & Candy
    { name: 'Hershey\'s Milk Chocolate Bar', category: 'Chocolates & Candy', brand: 'Hershey\'s', price: 1.99 },
    { name: 'Snickers Bar', category: 'Chocolates & Candy', brand: 'Mars', price: 1.79 },
    { name: 'KitKat Bar', category: 'Chocolates & Candy', brand: 'Nestle', price: 1.79 },
    { name: 'M&M\'s Peanut', category: 'Chocolates & Candy', brand: 'Mars', price: 2.49 },
    { name: 'Reese\'s Peanut Butter Cups', category: 'Chocolates & Candy', brand: 'Hershey\'s', price: 1.99 },
    { name: 'Twix Bar', category: 'Chocolates & Candy', brand: 'Mars', price: 1.79 },
    { name: 'Skittles', category: 'Chocolates & Candy', brand: 'Wrigley', price: 1.99 },
    { name: 'Sour Patch Kids', category: 'Chocolates & Candy', brand: 'Mondelez', price: 2.49 },

    // Beverages
    { name: 'Coca-Cola (12 pack)', category: 'Beverages', brand: 'Coca-Cola', price: 6.99 },
    { name: 'Orange Juice (52oz)', category: 'Beverages', brand: 'Tropicana', price: 4.99 },
    { name: 'Apple Juice (64oz)', category: 'Beverages', brand: 'Mott\'s', price: 3.99 },
    { name: 'Sparkling Water (12 pack)', category: 'Beverages', brand: 'LaCroix', price: 5.99 },
    { name: 'Iced Tea (64oz)', category: 'Beverages', brand: 'Arizona', price: 2.99 },
    { name: 'Gatorade Fruit Punch', category: 'Beverages', brand: 'Gatorade', price: 1.99 },
    { name: 'Spring Water (24 pack)', category: 'Beverages', brand: 'Deer Park', price: 4.99 },
    { name: 'Green Tea', category: 'Beverages', brand: 'Lipton', price: 3.49 },
    { name: 'Pepsi (12 pack)', category: 'Beverages', brand: 'Pepsi', price: 6.99 },

    // Breakfast
    { name: 'Cornflakes', category: 'Breakfast', brand: 'Kellogg\'s', price: 3.99 },
    { name: 'Instant Oatmeal', category: 'Breakfast', brand: 'Quaker', price: 4.49 },
    { name: 'Pancake Mix', category: 'Breakfast', brand: 'Bisquick', price: 3.99 },
    { name: 'Maple Syrup', category: 'Breakfast', brand: 'Log Cabin', price: 4.99 },
    { name: 'Frosted Flakes', category: 'Breakfast', brand: 'Kellogg\'s', price: 4.29 },
    { name: 'Cheerios', category: 'Breakfast', brand: 'General Mills', price: 4.49 },
    { name: 'Granola', category: 'Breakfast', brand: 'Quaker', price: 5.49 },
    { name: 'Pop-Tarts (8 pack)', category: 'Breakfast', brand: 'Kellogg\'s', price: 3.99 },

    // Canned & Packaged Foods
    { name: 'Canned Diced Tomatoes', category: 'Canned & Packaged Foods', brand: 'Hunt\'s', price: 1.29 },
    { name: 'Baked Beans', category: 'Canned & Packaged Foods', brand: 'Bush\'s', price: 1.99 },
    { name: 'Canned Tuna', category: 'Canned & Packaged Foods', brand: 'Starkist', price: 1.49 },
    { name: 'Tomato Soup', category: 'Canned & Packaged Foods', brand: 'Campbell\'s', price: 1.29 },
    { name: 'Chicken Noodle Soup', category: 'Canned & Packaged Foods', brand: 'Campbell\'s', price: 1.49 },
    { name: 'Black Beans', category: 'Canned & Packaged Foods', brand: 'Goya', price: 1.19 },
    { name: 'Peanut Butter', category: 'Canned & Packaged Foods', brand: 'Jif', price: 4.99 },
    { name: 'Strawberry Jam', category: 'Canned & Packaged Foods', brand: 'Smucker\'s', price: 3.49 },
    { name: 'Pasta Sauce (Marinara)', category: 'Canned & Packaged Foods', brand: 'Rao\'s', price: 8.99 },

    // Toiletries & Personal Care
    { name: 'Toothpaste', category: 'Toiletries & Personal Care', brand: 'Colgate', price: 3.49 },
    { name: 'Shampoo', category: 'Toiletries & Personal Care', brand: 'Head & Shoulders', price: 6.99 },
    { name: 'Body Wash', category: 'Toiletries & Personal Care', brand: 'Dove', price: 5.99 },
    { name: 'Hand Soap (Liquid)', category: 'Toiletries & Personal Care', brand: 'Softsoap', price: 2.99 },
    { name: 'Deodorant', category: 'Toiletries & Personal Care', brand: 'Old Spice', price: 5.49 },
    { name: 'Toilet Paper (12 rolls)', category: 'Toiletries & Personal Care', brand: 'Charmin', price: 9.99 },
    { name: 'Face Wash', category: 'Toiletries & Personal Care', brand: 'Cetaphil', price: 8.99 },
    { name: 'Conditioner', category: 'Toiletries & Personal Care', brand: 'Pantene', price: 5.99 },

    // Cleaning Supplies
    { name: 'Dish Soap', category: 'Cleaning Supplies', brand: 'Dawn', price: 3.49 },
    { name: 'Laundry Detergent', category: 'Cleaning Supplies', brand: 'Tide', price: 12.99 },
    { name: 'Surface Cleaner Spray', category: 'Cleaning Supplies', brand: 'Lysol', price: 4.99 },
    { name: 'Paper Towels (6 rolls)', category: 'Cleaning Supplies', brand: 'Bounty', price: 8.99 },
    { name: 'Sponges (3 pack)', category: 'Cleaning Supplies', brand: 'Scotch-Brite', price: 3.49 },
    { name: 'Trash Bags (20 pack)', category: 'Cleaning Supplies', brand: 'Hefty', price: 6.99 },
    { name: 'Bleach', category: 'Cleaning Supplies', brand: 'Clorox', price: 3.99 },
    { name: 'Floor Cleaner', category: 'Cleaning Supplies', brand: 'Fabuloso', price: 4.49 },
];

const CATEGORY_SHELF = {
    'Produce': 'Aisle 1',
    'Fruits': 'Aisle 1',
    'Dairy': 'Refrigerated',
    'Bakery': 'Aisle 2',
    'Pasta & Grains': 'Aisle 3',
    'Frozen Foods': 'Freezer',
    'Snacks': 'Aisle 4',
    'Chocolates & Candy': 'Aisle 4',
    'Beverages': 'Aisle 5',
    'Breakfast': 'Aisle 3',
    'Canned & Packaged Foods': 'Aisle 3',
    'Toiletries & Personal Care': 'Aisle 6',
    'Cleaning Supplies': 'Aisle 6',
};

const EXPIRY_RANGE = {
    'Produce': { min: -2, max: 7 },
    'Fruits': { min: -2, max: 10 },
    'Dairy': { min: -1, max: 14 },
    'Bakery': { min: -1, max: 5 },
    'Pasta & Grains': { min: 30, max: 365 },
    'Frozen Foods': { min: 30, max: 180 },
    'Snacks': { min: 14, max: 180 },
    'Chocolates & Candy': { min: 30, max: 365 },
    'Beverages': { min: 14, max: 180 },
    'Breakfast': { min: 14, max: 180 },
    'Canned & Packaged Foods': { min: 30, max: 730 },
    'Toiletries & Personal Care': { min: 180, max: 730 },
    'Cleaning Supplies': { min: 180, max: 730 },
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

        // Seed products
        const products = PRODUCTS.map((p) => {
            const range = EXPIRY_RANGE[p.category] || { min: 7, max: 90 };
            const numBatches = faker.number.int({ min: 2, max: 4 });
            const batches = Array.from({ length: numBatches }, () => {
                const qty = faker.number.int({ min: 10, max: 100 });
                return {
                    quantity: qty,
                    remainingQuantity: qty,
                    expiryDate: randomDate(faker.number.int({ min: range.min, max: range.max })),
                    receivedAt: randomDate(-faker.number.int({ min: 1, max: 14 })),
                };
            });

            return {
                name: p.name,
                category: p.category,
                brand: p.brand || '',
                price: p.price,
                shelfLocation: CATEGORY_SHELF[p.category] || 'Aisle 1',
                stockCount: faker.number.int({ min: 20, max: 150 }),
                batches,
                createdAt: new Date(),
            };
        });

        const insertedProducts = await db.collection('products').insertMany(products);
        console.log(`Seeded ${products.length} products...`);

        // Seed waste reports (800+)
        const productIds = Object.values(insertedProducts.insertedIds);
        const wasteReports = [];
        for (let i = 0; i < 1376; i++) {
            const idx = faker.number.int({ min: 0, max: productIds.length - 1 });
            wasteReports.push({
                productId: productIds[idx],
                productName: products[idx].name,
                quantityRemoved: faker.number.int({ min: 1, max: 15 }),
                reason: faker.helpers.arrayElement(REASONS),
                reportedBy: faker.helpers.arrayElement(EMPLOYEES),
                notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) || '',
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