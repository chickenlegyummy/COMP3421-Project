/**
 * Accessories Routes
 * Handles accessory listing, filtering, sorting, and details
 */

const express = require('express');
const router = express.Router();
const { allAsync, getAsync } = require('../database');

/**
 * GET /api/accessories
 * Get all accessories with filtering and sorting
 */
router.get('/', async (req, res) => {
    try {
        const {
            category,
            brand,
            minPrice,
            maxPrice,
            featured,
            sale,
            sort = 'featured',
            page = 1,
            limit = 12,
            search
        } = req.query;

        // Build WHERE clause
        let whereConditions = [];
        let params = [];

        if (category) {
            whereConditions.push('category = ?');
            params.push(category);
        }

        if (brand) {
            const brands = brand.split(',');
            const placeholders = brands.map(() => '?').join(',');
            whereConditions.push(`brand IN (${placeholders})`);
            params.push(...brands);
        }

        if (minPrice) {
            whereConditions.push('price >= ?');
            params.push(parseFloat(minPrice));
        }

        if (maxPrice) {
            whereConditions.push('price <= ?');
            params.push(parseFloat(maxPrice));
        }

        if (featured === 'true') {
            whereConditions.push('featured = 1');
        }

        if (sale === 'true') {
            whereConditions.push("badge = 'Sale'");
        }

        if (search) {
            whereConditions.push('(name LIKE ? OR description LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        const whereClause = whereConditions.length > 0 
            ? 'WHERE ' + whereConditions.join(' AND ')
            : '';

        // Build ORDER BY clause
        let orderBy = 'ORDER BY featured DESC, id ASC';
        switch (sort) {
            case 'price-asc':
                orderBy = 'ORDER BY price ASC';
                break;
            case 'price-desc':
                orderBy = 'ORDER BY price DESC';
                break;
            case 'name-asc':
                orderBy = 'ORDER BY name ASC';
                break;
            case 'name-desc':
                orderBy = 'ORDER BY name DESC';
                break;
            case 'featured':
            default:
                orderBy = 'ORDER BY featured DESC, id ASC';
                break;
        }

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM accessories ${whereClause}`;
        const countResult = await getAsync(countQuery, params);
        const total = countResult.total;

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Get paginated accessories
        const query = `
            SELECT id, name, category, brand, price, image, badge, featured, stock_quantity
            FROM accessories
            ${whereClause}
            ${orderBy}
            LIMIT ? OFFSET ?
        `;
        const accessories = await allAsync(query, [...params, limitNum, offset]);

        res.json({
            accessories,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Get accessories error:', error);
        res.status(500).json({ error: 'Failed to fetch accessories' });
    }
});

/**
 * GET /api/accessories/:id
 * Get accessory details by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const accessory = await getAsync(
            'SELECT * FROM accessories WHERE id = ?',
            [id]
        );

        if (!accessory) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        // Get related accessories (same category, excluding current)
        const relatedAccessories = await allAsync(
            `SELECT id, name, category, brand, price, image, badge, featured
             FROM accessories
             WHERE category = ? AND id != ?
             LIMIT 4`,
            [accessory.category, id]
        );

        res.json({
            ...accessory,
            relatedAccessories
        });
    } catch (error) {
        console.error('Get accessory details error:', error);
        res.status(500).json({ error: 'Failed to fetch accessory details' });
    }
});

module.exports = router;
