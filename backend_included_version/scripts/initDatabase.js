/**
 * Database Initialization Script
 * Seeds the database with initial products and accessories data
 */

require('dotenv').config();
const { db, runAsync, initializeTables } = require('../database');

// Products data from the frontend
const PRODUCTS = [
    { id: 1, name: 'Les Paul Standard', category: 'electric', brand: 'gibson', price: 2999, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: 'New', featured: 1, stock_quantity: 15, description: 'Iconic Les Paul with classic tone and feel. Features dual humbuckers and mahogany body.' },
    { id: 2, name: 'Stratocaster Deluxe', category: 'electric', brand: 'fender', price: 2499, image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=300', badge: 'Sale', featured: 1, stock_quantity: 20, description: 'Legendary Stratocaster with versatile tone. Three single-coil pickups.' },
    { id: 3, name: 'Acoustic Dreadnought', category: 'acoustic', brand: 'martin', price: 1899, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: '', featured: 1, stock_quantity: 12, description: 'Rich, powerful acoustic tone with solid spruce top.' },
    { id: 4, name: 'Jazz Bass Premium', category: 'bass', brand: 'fender', price: 2299, image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300', badge: 'Popular', featured: 1, stock_quantity: 10, description: 'Classic Jazz Bass with smooth playability and punchy tone.' },
    { id: 5, name: 'SG Special', category: 'electric', brand: 'gibson', price: 1599, image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=300', badge: '', featured: 0, stock_quantity: 18, description: 'Lightweight SG with powerful dual humbuckers.' },
    { id: 6, name: 'Telecaster Classic', category: 'electric', brand: 'fender', price: 1899, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300', badge: 'Sale', featured: 0, stock_quantity: 14, description: 'Classic Telecaster twang with modern reliability.' },
    { id: 7, name: 'Classical Pro', category: 'classical', brand: 'martin', price: 899, image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=300', badge: '', featured: 0, stock_quantity: 25, description: 'Professional nylon-string guitar with warm tone.' },
    { id: 8, name: 'RG Series', category: 'electric', brand: 'ibanez', price: 799, image: 'https://images.unsplash.com/photo-1558272287-4fbd5d9bfd9d?w=300', badge: 'New', featured: 0, stock_quantity: 22, description: 'Fast-playing RG with versatile pickup configuration.' },
    { id: 9, name: 'Precision Bass', category: 'bass', brand: 'fender', price: 1799, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: '', featured: 0, stock_quantity: 16, description: 'The original electric bass with timeless tone.' },
    { id: 10, name: 'J-45 Acoustic', category: 'acoustic', brand: 'gibson', price: 2799, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'Popular', featured: 0, stock_quantity: 8, description: 'Legendary acoustic with balanced, rich tone.' },
    { id: 11, name: 'Explorer', category: 'electric', brand: 'gibson', price: 2199, image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=300', badge: '', featured: 0, stock_quantity: 11, description: 'Bold Explorer design with aggressive tone.' },
    { id: 12, name: 'SR Bass', category: 'bass', brand: 'ibanez', price: 699, image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300', badge: 'Sale', featured: 0, stock_quantity: 19, description: 'Sleek SR bass with active electronics.' },
    { id: 13, name: 'D-28 Acoustic', category: 'acoustic', brand: 'martin', price: 3199, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'New', featured: 0, stock_quantity: 6, description: 'Premium D-28 with legendary Martin tone.' },
    { id: 14, name: 'Jem Series', category: 'electric', brand: 'ibanez', price: 1999, image: 'https://images.unsplash.com/photo-1558272287-4fbd5d9bfd9d?w=300', badge: '', featured: 0, stock_quantity: 13, description: 'Signature Jem with floating tremolo system.' },
    { id: 15, name: 'Nylon Classical', category: 'classical', brand: 'gibson', price: 1299, image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=300', badge: '', featured: 0, stock_quantity: 17, description: 'Classical guitar with exceptional projection.' },
    { id: 16, name: 'American Ultra', category: 'electric', brand: 'fender', price: 2899, image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=300', badge: 'Popular', featured: 1, stock_quantity: 9, description: 'Top-tier American Ultra with modern features.' }
];

// Accessories data from the frontend
const ACCESSORIES = [
    { id: 101, name: 'Electric Guitar Strings Set', category: 'strings', brand: 'daddario', price: 12.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: 'Popular', featured: 1, stock_quantity: 100, description: 'Premium nickel wound strings for electric guitar.' },
    { id: 102, name: 'Acoustic Guitar Strings', category: 'strings', brand: 'ernieball', price: 14.99, image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300', badge: 'Sale', featured: 1, stock_quantity: 85, description: 'Bronze wound acoustic guitar strings.' },
    { id: 103, name: 'Premium Guitar Picks Pack', category: 'picks', brand: 'dunlop', price: 8.99, image: 'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=300', badge: '', featured: 1, stock_quantity: 200, description: 'Assorted thickness guitar pick variety pack.' },
    { id: 104, name: 'Jazz III Guitar Picks', category: 'picks', brand: 'dunlop', price: 6.99, image: 'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=300', badge: 'New', featured: 0, stock_quantity: 150, description: 'Precision Jazz III picks for fast playing.' },
    { id: 105, name: 'Hard Shell Guitar Case', category: 'cases', brand: 'fender', price: 149.99, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: '', featured: 1, stock_quantity: 30, description: 'Durable hard shell case with plush interior.' },
    { id: 106, name: 'Gig Bag Deluxe', category: 'cases', brand: 'mono', price: 89.99, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: 'Popular', featured: 0, stock_quantity: 45, description: 'Premium padded gig bag with storage.' },
    { id: 107, name: 'Professional Guitar Cable 20ft', category: 'cables', brand: 'monster', price: 39.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: 'Sale', featured: 0, stock_quantity: 60, description: 'High-quality instrument cable with lifetime warranty.' },
    { id: 108, name: 'Instrument Cable 10ft', category: 'cables', brand: 'planetwaves', price: 24.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: '', featured: 0, stock_quantity: 75, description: 'Reliable 10ft instrument cable.' },
    { id: 109, name: 'Overdrive Pedal', category: 'pedals', brand: 'boss', price: 129.99, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'Popular', featured: 1, stock_quantity: 25, description: 'Classic overdrive tone pedal.' },
    { id: 110, name: 'Delay Pedal', category: 'pedals', brand: 'tcelectronic', price: 149.99, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: '', featured: 0, stock_quantity: 20, description: 'Digital delay with tap tempo.' },
    { id: 111, name: 'Reverb Pedal', category: 'pedals', brand: 'electroharmonix', price: 169.99, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'New', featured: 0, stock_quantity: 18, description: 'Lush reverb with multiple modes.' },
    { id: 112, name: 'Chromatic Tuner Pedal', category: 'tuners', brand: 'boss', price: 99.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: '', featured: 0, stock_quantity: 35, description: 'Accurate chromatic tuner pedal.' },
    { id: 113, name: 'Clip-On Tuner', category: 'tuners', brand: 'snark', price: 19.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: 'Sale', featured: 0, stock_quantity: 120, description: 'Convenient clip-on chromatic tuner.' },
    { id: 114, name: 'Bass Guitar Strings', category: 'strings', brand: 'ernieball', price: 29.99, image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300', badge: '', featured: 0, stock_quantity: 70, description: 'Nickel wound bass guitar strings.' },
    { id: 115, name: 'Guitar Strap Leather', category: 'cases', brand: 'levy', price: 49.99, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: 'Popular', featured: 0, stock_quantity: 55, description: 'Comfortable leather guitar strap.' },
    { id: 116, name: 'Pedalboard Case', category: 'cases', brand: 'pedaltrain', price: 199.99, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'New', featured: 1, stock_quantity: 15, description: 'Professional pedalboard with case.' }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // First, ensure all tables are created
        await initializeTables();

        // Clear existing data
        await runAsync('DELETE FROM products');
        await runAsync('DELETE FROM accessories');
        console.log('✅ Cleared existing data');

        // Insert products
        const productStmt = db.prepare(`
            INSERT INTO products (id, name, category, brand, price, image, badge, featured, stock_quantity, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const product of PRODUCTS) {
            await new Promise((resolve, reject) => {
                productStmt.run(
                    product.id,
                    product.name,
                    product.category,
                    product.brand,
                    product.price,
                    product.image,
                    product.badge,
                    product.featured,
                    product.stock_quantity,
                    product.description,
                    (err) => err ? reject(err) : resolve()
                );
            });
        }
        productStmt.finalize();
        console.log(`✅ Inserted ${PRODUCTS.length} products`);

        // Insert accessories
        const accessoryStmt = db.prepare(`
            INSERT INTO accessories (id, name, category, brand, price, image, badge, featured, stock_quantity, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const accessory of ACCESSORIES) {
            await new Promise((resolve, reject) => {
                accessoryStmt.run(
                    accessory.id,
                    accessory.name,
                    accessory.category,
                    accessory.brand,
                    accessory.price,
                    accessory.image,
                    accessory.badge,
                    accessory.featured,
                    accessory.stock_quantity,
                    accessory.description,
                    (err) => err ? reject(err) : resolve()
                );
            });
        }
        accessoryStmt.finalize();
        console.log(`✅ Inserted ${ACCESSORIES.length} accessories`);

        console.log('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run seeding
seedDatabase();
