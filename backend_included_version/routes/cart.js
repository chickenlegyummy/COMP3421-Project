/**
 * Cart Routes
 * Handles shopping cart operations
 */

const express = require('express');
const router = express.Router();
const { allAsync, getAsync, runAsync } = require('../database');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/cart
 * Get user's cart items
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const cartItems = await allAsync(`
            SELECT 
                ci.id,
                ci.product_id,
                ci.accessory_id,
                ci.product_type,
                ci.quantity,
                CASE 
                    WHEN ci.product_type = 'product' THEN p.name
                    ELSE a.name
                END as name,
                CASE 
                    WHEN ci.product_type = 'product' THEN p.price
                    ELSE a.price
                END as price,
                CASE 
                    WHEN ci.product_type = 'product' THEN p.image
                    ELSE a.image
                END as image,
                CASE 
                    WHEN ci.product_type = 'product' THEN p.category
                    ELSE a.category
                END as category
            FROM cart_items ci
            LEFT JOIN products p ON ci.product_id = p.id
            LEFT JOIN accessories a ON ci.accessory_id = a.id
            WHERE ci.user_id = ?
        `, [userId]);

        // Format cart items
        const formattedCart = cartItems.map(item => ({
            id: item.product_id || item.accessory_id,
            cartItemId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            quantity: item.quantity,
            productType: item.product_type
        }));

        res.json({ cart: formattedCart });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

/**
 * POST /api/cart
 * Add item to cart
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, accessoryId, productType, quantity = 1 } = req.body;

        if (!productType || (!productId && !accessoryId)) {
            return res.status(400).json({ error: 'Product/Accessory ID and type required' });
        }

        // Check if item already exists in cart
        const existingItem = await getAsync(`
            SELECT * FROM cart_items 
            WHERE user_id = ? AND product_type = ? AND ${productType === 'product' ? 'product_id' : 'accessory_id'} = ?
        `, [userId, productType, productId || accessoryId]);

        if (existingItem) {
            // Update quantity
            await runAsync(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [quantity, existingItem.id]
            );
            res.json({ message: 'Cart updated', cartItemId: existingItem.id });
        } else {
            // Insert new item
            const result = await runAsync(`
                INSERT INTO cart_items (user_id, product_id, accessory_id, product_type, quantity)
                VALUES (?, ?, ?, ?, ?)
            `, [userId, productId || null, accessoryId || null, productType, quantity]);

            res.status(201).json({ message: 'Item added to cart', cartItemId: result.lastID });
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});

/**
 * PUT /api/cart/:itemId
 * Update cart item quantity
 */
router.put('/:itemId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        await runAsync(
            'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, itemId, userId]
        );

        res.json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

/**
 * DELETE /api/cart/:itemId
 * Remove item from cart
 */
router.delete('/:itemId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { itemId } = req.params;

        await runAsync(
            'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
            [itemId, userId]
        );

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
});

/**
 * DELETE /api/cart
 * Clear entire cart
 */
router.delete('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        await runAsync('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

module.exports = router;
