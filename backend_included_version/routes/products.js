/**
 * Products Routes
 * Handles product listing, filtering, sorting, and details
 */

const express = require('express');
const router = express.Router();
const { allAsync, getAsync } = require('../database');

/**
 * GET /api/products
 * Get all products with filtering and sorting
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
        const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
        const countResult = await getAsync(countQuery, params);
        const total = countResult.total;

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Get paginated products
        const query = `
            SELECT id, name, category, brand, price, image, badge, featured, stock_quantity
            FROM products
            ${whereClause}
            ${orderBy}
            LIMIT ? OFFSET ?
        `;
        const products = await allAsync(query, [...params, limitNum, offset]);

        res.json({
            products,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

/**
 * GET /api/products/:id
 * Get product details by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await getAsync(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get related products (same category, excluding current product)
        const relatedProducts = await allAsync(
            `SELECT id, name, category, brand, price, image, badge, featured
             FROM products
             WHERE category = ? AND id != ?
             LIMIT 4`,
            [product.category, id]
        );

        res.json({
            ...product,
            relatedProducts
        });
    } catch (error) {
        console.error('Get product details error:', error);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
});

/**
 * GET /api/products/featured/list
 * Get featured products for homepage
 */
router.get('/featured/list', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        const products = await allAsync(
            `SELECT id, name, category, brand, price, image, badge, featured
             FROM products
             WHERE featured = 1
             ORDER BY id ASC
             LIMIT ?`,
            [limit]
        );

        res.json(products);
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({ error: 'Failed to fetch featured products' });
    }
});

module.exports = router;
