/**
 * Reviews Routes
 * Handles product and accessory reviews
 */

const express = require('express');
const router = express.Router();
const { allAsync, getAsync, runAsync } = require('../database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

/**
 * GET /api/reviews/:productType/:productId
 * Get reviews for a product or accessory
 */
router.get('/:productType/:productId', async (req, res) => {
    try {
        const { productType, productId } = req.params;

        if (productType !== 'product' && productType !== 'accessory') {
            return res.status(400).json({ error: 'Invalid product type' });
        }

        const idColumn = productType === 'product' ? 'product_id' : 'accessory_id';

        const reviews = await allAsync(`
            SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                u.first_name,
                u.last_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.${idColumn} = ? AND r.product_type = ?
            ORDER BY r.created_at DESC
        `, [productId, productType]);

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        res.json({
            reviews: reviews.map(r => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.created_at,
                userName: `${r.first_name} ${r.last_name}`
            })),
            averageRating: avgRating.toFixed(1),
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

/**
 * POST /api/reviews
 * Create a new review
 */
router.post('/', authenticateToken, [
    body('productType').isIn(['product', 'accessory']),
    body('productId').isInt(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.userId;
        const { productType, productId, rating, comment } = req.body;

        // Check if user already reviewed this product
        const idColumn = productType === 'product' ? 'product_id' : 'accessory_id';
        const existingReview = await getAsync(`
            SELECT id FROM reviews
            WHERE user_id = ? AND ${idColumn} = ? AND product_type = ?
        `, [userId, productId, productType]);

        if (existingReview) {
            return res.status(409).json({ error: 'You have already reviewed this item' });
        }

        // Insert review
        const result = await runAsync(`
            INSERT INTO reviews (user_id, ${idColumn}, product_type, rating, comment)
            VALUES (?, ?, ?, ?, ?)
        `, [
            userId,
            productId,
            productType,
            rating,
            comment || null
        ]);

        res.status(201).json({
            message: 'Review submitted successfully',
            reviewId: result.lastID
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

/**
 * DELETE /api/reviews/:id
 * Delete a review (user can only delete their own)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const review = await getAsync(
            'SELECT user_id FROM reviews WHERE id = ?',
            [id]
        );

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await runAsync('DELETE FROM reviews WHERE id = ?', [id]);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router;
