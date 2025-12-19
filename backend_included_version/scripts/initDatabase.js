/**
 * Database Initialization Script
 * Seeds the database with initial products and accessories data
 */

require('dotenv').config();
const { db, runAsync, initializeTables } = require('../database');

// Products data from the frontend
const PRODUCTS = [
    { id: 1, name: 'Les Paul Standard', category: 'electric', brand: 'gibson', price: 2999, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: 'New', featured: 1, stock_quantity: 15, description: 'Iconic Les Paul with classic tone and feel. Features dual humbuckers and mahogany body.', specs: JSON.stringify({ 'Body Material': 'Mahogany', 'Top Material': 'Maple', 'Neck Material': 'Mahogany', 'Fretboard': 'Rosewood', 'Scale Length': '24.75"', 'Frets': '22', 'Pickups': 'Humbucker x2', 'Hardware': 'Chrome' }) },
    { id: 2, name: 'Stratocaster Deluxe', category: 'electric', brand: 'fender', price: 2499, image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=300', badge: 'Sale', featured: 1, stock_quantity: 20, description: 'Legendary Stratocaster with versatile tone. Three single-coil pickups.', specs: JSON.stringify({ 'Body Material': 'Alder', 'Neck Material': 'Maple', 'Fretboard': 'Maple', 'Scale Length': '25.5"', 'Frets': '22', 'Pickups': 'Single-Coil x3', 'Hardware': 'Chrome', 'Tremolo': 'Synchronized' }) },
    { id: 3, name: 'Acoustic Dreadnought', category: 'acoustic', brand: 'martin', price: 1899, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: '', featured: 1, stock_quantity: 12, description: 'Rich, powerful acoustic tone with solid spruce top.', specs: JSON.stringify({ 'Top Material': 'Solid Spruce', 'Back & Sides': 'Mahogany', 'Neck': 'Mahogany', 'Fretboard': 'Rosewood', 'Scale Length': '25.4"', 'Frets': '20', 'Bracing': 'X-Bracing', 'Finish': 'Gloss' }) },
    { id: 4, name: 'Jazz Bass Premium', category: 'bass', brand: 'fender', price: 2299, image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300', badge: 'Popular', featured: 1, stock_quantity: 10, description: 'Classic Jazz Bass with smooth playability and punchy tone.', specs: JSON.stringify({ 'Body Material': 'Alder', 'Neck Material': 'Maple', 'Fretboard': 'Rosewood', 'Scale Length': '34"', 'Frets': '20', 'Pickups': 'Single-Coil x2', 'Strings': '4-String', 'Hardware': 'Chrome' }) },
    { id: 5, name: 'SG Special', category: 'electric', brand: 'gibson', price: 1599, image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=300', badge: '', featured: 0, stock_quantity: 18, description: 'Lightweight SG with powerful dual humbuckers.', specs: JSON.stringify({ 'Body Material': 'Mahogany', 'Neck Material': 'Mahogany', 'Fretboard': 'Rosewood', 'Scale Length': '24.75"', 'Frets': '22', 'Pickups': 'Humbucker x2', 'Hardware': 'Chrome', 'Weight': 'Lightweight' }) },
    { id: 6, name: 'Telecaster Classic', category: 'electric', brand: 'fender', price: 1899, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300', badge: 'Sale', featured: 0, stock_quantity: 14, description: 'Classic Telecaster twang with modern reliability.', specs: JSON.stringify({ 'Body Material': 'Ash', 'Neck Material': 'Maple', 'Fretboard': 'Maple', 'Scale Length': '25.5"', 'Frets': '22', 'Pickups': 'Single-Coil x2', 'Bridge': 'Fixed', 'Hardware': 'Chrome' }) },
    { id: 7, name: 'Classical Pro', category: 'classical', brand: 'martin', price: 899, image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=300', badge: '', featured: 0, stock_quantity: 25, description: 'Professional nylon-string guitar with warm tone.', specs: JSON.stringify({ 'Top Material': 'Solid Cedar', 'Back & Sides': 'Rosewood', 'Neck': 'Mahogany', 'Fretboard': 'Ebony', 'Scale Length': '25.6"', 'Frets': '19', 'Strings': 'Nylon', 'Finish': 'Gloss' }) },
    { id: 8, name: 'RG Series', category: 'electric', brand: 'ibanez', price: 799, image: 'https://images.unsplash.com/photo-1558272287-4fbd5d9bfd9d?w=300', badge: 'New', featured: 0, stock_quantity: 22, description: 'Fast-playing RG with versatile pickup configuration.', specs: JSON.stringify({ 'Body Material': 'Basswood', 'Neck Material': 'Maple', 'Fretboard': 'Jatoba', 'Scale Length': '25.5"', 'Frets': '24', 'Pickups': 'HSH', 'Tremolo': 'Edge-Zero II', 'Hardware': 'Black' }) },
    { id: 9, name: 'Precision Bass', category: 'bass', brand: 'fender', price: 1799, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: '', featured: 0, stock_quantity: 16, description: 'The original electric bass with timeless tone.', specs: JSON.stringify({ 'Body Material': 'Alder', 'Neck Material': 'Maple', 'Fretboard': 'Maple', 'Scale Length': '34"', 'Frets': '20', 'Pickups': 'Split-Coil', 'Strings': '4-String', 'Hardware': 'Chrome' }) },
    { id: 10, name: 'J-45 Acoustic', category: 'acoustic', brand: 'gibson', price: 2799, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'Popular', featured: 0, stock_quantity: 8, description: 'Legendary acoustic with balanced, rich tone.', specs: JSON.stringify({ 'Top Material': 'Solid Sitka Spruce', 'Back & Sides': 'Mahogany', 'Neck': 'Mahogany', 'Fretboard': 'Rosewood', 'Scale Length': '24.75"', 'Frets': '20', 'Bracing': 'X-Bracing', 'Finish': 'Gloss' }) },
    { id: 11, name: 'Explorer', category: 'electric', brand: 'gibson', price: 2199, image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=300', badge: '', featured: 0, stock_quantity: 11, description: 'Bold Explorer design with aggressive tone.', specs: JSON.stringify({ 'Body Material': 'Mahogany', 'Neck Material': 'Mahogany', 'Fretboard': 'Rosewood', 'Scale Length': '24.75"', 'Frets': '22', 'Pickups': 'Humbucker x2', 'Hardware': 'Chrome', 'Shape': 'Explorer' }) },
    { id: 12, name: 'SR Bass', category: 'bass', brand: 'ibanez', price: 699, image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300', badge: 'Sale', featured: 0, stock_quantity: 19, description: 'Sleek SR bass with active electronics.', specs: JSON.stringify({ 'Body Material': 'Mahogany', 'Neck Material': 'Maple', 'Fretboard': 'Jatoba', 'Scale Length': '34"', 'Frets': '24', 'Pickups': 'Active P/J', 'Strings': '4-String', 'Hardware': 'Black' }) },
    { id: 13, name: 'D-28 Acoustic', category: 'acoustic', brand: 'martin', price: 3199, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'New', featured: 0, stock_quantity: 6, description: 'Premium D-28 with legendary Martin tone.', specs: JSON.stringify({ 'Top Material': 'Solid Sitka Spruce', 'Back & Sides': 'East Indian Rosewood', 'Neck': 'Select Hardwood', 'Fretboard': 'Ebony', 'Scale Length': '25.4"', 'Frets': '20', 'Bracing': 'Forward-Shifted X', 'Finish': 'Gloss' }) },
    { id: 14, name: 'Jem Series', category: 'electric', brand: 'ibanez', price: 1999, image: 'https://images.unsplash.com/photo-1558272287-4fbd5d9bfd9d?w=300', badge: '', featured: 0, stock_quantity: 13, description: 'Signature Jem with floating tremolo system.', specs: JSON.stringify({ 'Body Material': 'Basswood', 'Neck Material': 'Maple', 'Fretboard': 'Rosewood', 'Scale Length': '25.5"', 'Frets': '24', 'Pickups': 'HSH', 'Tremolo': 'Edge', 'Hardware': 'Gold' }) },
    { id: 15, name: 'Nylon Classical', category: 'classical', brand: 'gibson', price: 1299, image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=300', badge: '', featured: 0, stock_quantity: 17, description: 'Classical guitar with exceptional projection.', specs: JSON.stringify({ 'Top Material': 'Solid Cedar', 'Back & Sides': 'Mahogany', 'Neck': 'Mahogany', 'Fretboard': 'Rosewood', 'Scale Length': '25.6"', 'Frets': '19', 'Strings': 'Nylon', 'Finish': 'Satin' }) },
    { id: 16, name: 'American Ultra', category: 'electric', brand: 'fender', price: 2899, image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=300', badge: 'Popular', featured: 1, stock_quantity: 9, description: 'Top-tier American Ultra with modern features.', specs: JSON.stringify({ 'Body Material': 'Alder', 'Neck Material': 'Maple', 'Fretboard': 'Maple', 'Scale Length': '25.5"', 'Frets': '22', 'Pickups': 'Ultra Noiseless x3', 'Tremolo': 'Modern', 'Hardware': 'Chrome' }) }
];

// Accessories data from the frontend
const ACCESSORIES = [
    { id: 101, name: 'Electric Guitar Strings Set', category: 'strings', brand: 'daddario', price: 12.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: 'Popular', featured: 1, stock_quantity: 100, description: 'Premium nickel wound strings for electric guitar.', specs: JSON.stringify({ 'Material': 'Nickel Wound', 'Gauge': '.010-.046', 'Strings': '6-String Set', 'Coating': 'Uncoated', 'Tone': 'Bright' }) },
    { id: 102, name: 'Acoustic Guitar Strings', category: 'strings', brand: 'ernieball', price: 14.99, image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300', badge: 'Sale', featured: 1, stock_quantity: 85, description: 'Bronze wound acoustic guitar strings.', specs: JSON.stringify({ 'Material': '80/20 Bronze', 'Gauge': '.012-.054', 'Strings': '6-String Set', 'Coating': 'Uncoated', 'Tone': 'Bright & Balanced' }) },
    { id: 103, name: 'Premium Guitar Picks Pack', category: 'picks', brand: 'dunlop', price: 8.99, image: 'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=300', badge: '', featured: 1, stock_quantity: 200, description: 'Assorted thickness guitar pick variety pack.', specs: JSON.stringify({ 'Material': 'Delrin', 'Quantity': '12 Picks', 'Thickness': 'Assorted (.60mm-.96mm)', 'Shape': 'Standard', 'Finish': 'Textured' }) },
    { id: 104, name: 'Jazz III Guitar Picks', category: 'picks', brand: 'dunlop', price: 6.99, image: 'https://images.unsplash.com/photo-1614963042989-c20d89097a68?w=300', badge: 'New', featured: 0, stock_quantity: 150, description: 'Precision Jazz III picks for fast playing.', specs: JSON.stringify({ 'Material': 'Nylon', 'Quantity': '6 Picks', 'Thickness': '1.38mm', 'Shape': 'Jazz III', 'Finish': 'Red' }) },
    { id: 105, name: 'Hard Shell Guitar Case', category: 'cases', brand: 'fender', price: 149.99, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: '', featured: 1, stock_quantity: 30, description: 'Durable hard shell case with plush interior.', specs: JSON.stringify({ 'Type': 'Hard Shell', 'Exterior': 'ABS Molded', 'Interior': 'Plush Lined', 'Fits': 'Electric Guitars', 'Locks': 'TSA Approved', 'Weight': '8 lbs' }) },
    { id: 106, name: 'Gig Bag Deluxe', category: 'cases', brand: 'mono', price: 89.99, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: 'Popular', featured: 0, stock_quantity: 45, description: 'Premium padded gig bag with storage.', specs: JSON.stringify({ 'Type': 'Gig Bag', 'Padding': '20mm', 'Storage': 'Multiple Pockets', 'Fits': 'Acoustic/Electric', 'Straps': 'Backpack Style', 'Water Resistant': 'Yes' }) },
    { id: 107, name: 'Professional Guitar Cable 20ft', category: 'cables', brand: 'monster', price: 39.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: 'Sale', featured: 0, stock_quantity: 60, description: 'High-quality instrument cable with lifetime warranty.', specs: JSON.stringify({ 'Length': '20 feet', 'Connectors': '1/4" Straight', 'Conductor': '95% Coverage', 'Capacitance': '24pF/ft', 'Warranty': 'Lifetime' }) },
    { id: 108, name: 'Instrument Cable 10ft', category: 'cables', brand: 'planetwaves', price: 24.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: '', featured: 0, stock_quantity: 75, description: 'Reliable 10ft instrument cable.', specs: JSON.stringify({ 'Length': '10 feet', 'Connectors': '1/4" Straight', 'Conductor': '90% Coverage', 'Capacitance': '30pF/ft', 'Warranty': '1 Year' }) },
    { id: 109, name: 'Overdrive Pedal', category: 'pedals', brand: 'boss', price: 129.99, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'Popular', featured: 1, stock_quantity: 25, description: 'Classic overdrive tone pedal.', specs: JSON.stringify({ 'Type': 'Overdrive', 'Controls': 'Level, Tone, Drive', 'True Bypass': 'Yes', 'Power': '9V DC', 'Dimensions': '2.9" x 5.1" x 2.4"' }) },
    { id: 110, name: 'Delay Pedal', category: 'pedals', brand: 'tcelectronic', price: 149.99, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: '', featured: 0, stock_quantity: 20, description: 'Digital delay with tap tempo.', specs: JSON.stringify({ 'Type': 'Digital Delay', 'Controls': 'Time, Feedback, Level', 'Tap Tempo': 'Yes', 'Max Delay': '7 Seconds', 'Power': '9V DC' }) },
    { id: 111, name: 'Reverb Pedal', category: 'pedals', brand: 'electroharmonix', price: 169.99, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'New', featured: 0, stock_quantity: 18, description: 'Lush reverb with multiple modes.', specs: JSON.stringify({ 'Type': 'Digital Reverb', 'Modes': 'Spring, Hall, Plate, Shimmer', 'Controls': 'Decay, Mix, Tone', 'True Bypass': 'Yes', 'Power': '9V DC' }) },
    { id: 112, name: 'Chromatic Tuner Pedal', category: 'tuners', brand: 'boss', price: 99.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: '', featured: 0, stock_quantity: 35, description: 'Accurate chromatic tuner pedal.', specs: JSON.stringify({ 'Type': 'Chromatic Tuner', 'Display': 'LED', 'Accuracy': '±1 cent', 'True Bypass': 'Yes', 'Power': '9V DC', 'Dimensions': '2.9" x 5.1" x 2.4"' }) },
    { id: 113, name: 'Clip-On Tuner', category: 'tuners', brand: 'snark', price: 19.99, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300', badge: 'Sale', featured: 0, stock_quantity: 120, description: 'Convenient clip-on chromatic tuner.', specs: JSON.stringify({ 'Type': 'Clip-On Tuner', 'Display': 'Color LCD', 'Modes': 'Chromatic, Guitar, Bass', 'Range': 'A0-A4', 'Battery': 'CR2032', 'Auto Shutoff': 'Yes' }) },
    { id: 114, name: 'Bass Guitar Strings', category: 'strings', brand: 'ernieball', price: 29.99, image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300', badge: '', featured: 0, stock_quantity: 70, description: 'Nickel wound bass guitar strings.', specs: JSON.stringify({ 'Material': 'Nickel Wound', 'Gauge': '.045-.105', 'Strings': '4-String Set', 'Scale': 'Long Scale', 'Coating': 'Uncoated', 'Tone': 'Balanced' }) },
    { id: 115, name: 'Guitar Strap Leather', category: 'cases', brand: 'levy', price: 49.99, image: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=300', badge: 'Popular', featured: 0, stock_quantity: 55, description: 'Comfortable leather guitar strap.', specs: JSON.stringify({ 'Material': 'Genuine Leather', 'Width': '2.5 inches', 'Length': 'Adjustable 42"-60"', 'Padding': 'Suede Backing', 'Hardware': 'Steel', 'Color': 'Brown' }) },
    { id: 116, name: 'Pedalboard Case', category: 'cases', brand: 'pedaltrain', price: 199.99, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=300', badge: 'New', featured: 1, stock_quantity: 15, description: 'Professional pedalboard with case.', specs: JSON.stringify({ 'Type': 'Pedalboard with Case', 'Size': '24" x 12.5"', 'Pedal Capacity': '8-10 Pedals', 'Case': 'Soft Case Included', 'Mounting': 'Hook & Loop', 'Weight': '6 lbs' }) }
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
            INSERT INTO products (id, name, category, brand, price, image, badge, featured, stock_quantity, description, specs)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                    product.specs,
                    (err) => err ? reject(err) : resolve()
                );
            });
        }
        productStmt.finalize();
        console.log(`✅ Inserted ${PRODUCTS.length} products`);

        // Insert accessories
        const accessoryStmt = db.prepare(`
            INSERT INTO accessories (id, name, category, brand, price, image, badge, featured, stock_quantity, description, specs)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                    accessory.specs,
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
