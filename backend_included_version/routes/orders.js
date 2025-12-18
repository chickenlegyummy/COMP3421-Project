/**
 * Orders Routes
 * Handles order creation and management
 */

const express = require('express');
const router = express.Router();
const { allAsync, getAsync, runAsync, db } = require('../database');
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/orders
 * Create new order from cart
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { shippingAddress, paymentMethod } = req.body;

        // Get cart items
        const cartItems = await allAsync(`
            SELECT 
                ci.*,
                CASE 
                    WHEN ci.product_type = 'product' THEN p.name
                    ELSE a.name
                END as name,
                CASE 
                    WHEN ci.product_type = 'product' THEN p.price
                    ELSE a.price
                END as price
            FROM cart_items ci
            LEFT JOIN products p ON ci.product_id = p.id
            LEFT JOIN accessories a ON ci.accessory_id = a.id
            WHERE ci.user_id = ?
        `, [userId]);

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total
        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Create order in transaction
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                // Insert order
                db.run(
                    `INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, status)
                     VALUES (?, ?, ?, ?, 'pending')`,
                    [userId, totalAmount, shippingAddress, paymentMethod],
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject(err);
                        }

                        const orderId = this.lastID;

                        // Insert order items
                        const stmt = db.prepare(`
                            INSERT INTO order_items (order_id, product_id, accessory_id, product_type, product_name, quantity, price)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        `);

                        let completed = 0;
                        cartItems.forEach((item) => {
                            stmt.run(
                                orderId,
                                item.product_id,
                                item.accessory_id,
                                item.product_type,
                                item.name,
                                item.quantity,
                                item.price,
                                (err) => {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        stmt.finalize();
                                        return reject(err);
                                    }

                                    completed++;
                                    if (completed === cartItems.length) {
                                        stmt.finalize();

                                        // Clear cart
                                        db.run('DELETE FROM cart_items WHERE user_id = ?', [userId], (err) => {
                                            if (err) {
                                                db.run('ROLLBACK');
                                                return reject(err);
                                            }

                                            db.run('COMMIT', (err) => {
                                                if (err) {
                                                    db.run('ROLLBACK');
                                                    return reject(err);
                                                }
                                                resolve(orderId);
                                            });
                                        });
                                    }
                                }
                            );
                        });
                    }
                );
            });
        }).then((orderId) => {
            res.status(201).json({
                message: 'Order created successfully',
                orderId,
                totalAmount
            });
        }).catch((error) => {
            throw error;
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

/**
 * GET /api/orders
 * Get user's orders
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await allAsync(`
            SELECT id, total_amount, status, shipping_address, payment_method, created_at
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [userId]);

        // Get order items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const items = await allAsync(`
                SELECT product_id, accessory_id, product_type, product_name, quantity, price
                FROM order_items
                WHERE order_id = ?
            `, [order.id]);

            return {
                ...order,
                items
            };
        }));

        res.json({ orders: ordersWithItems });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

/**
 * GET /api/orders/:id
 * Get specific order details
 */
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const order = await getAsync(`
            SELECT * FROM orders
            WHERE id = ? AND user_id = ?
        `, [id, userId]);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const items = await allAsync(`
            SELECT * FROM order_items
            WHERE order_id = ?
        `, [id]);

        res.json({
            ...order,
            items
        });
    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});

module.exports = router;
