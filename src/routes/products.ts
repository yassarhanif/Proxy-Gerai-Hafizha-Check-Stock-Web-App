import { Router, Request, Response } from 'express';
import pool from '../services/db';
import logger from '../utils/logger';

const router = Router();

// Define product type
interface Product {
  id: string;
  name: string;
  barcode: string;
  stock: number;
  price: number;
  category?: string;
  last_updated?: string;
}

// Search products by name or barcode
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { name, barcode } = req.query;

    // Validate that either name or barcode is provided
    if (!name && !barcode) {
      logger.warn('Product search called without name or barcode parameter');
      return res.status(400).json({ error: 'Either name or barcode parameter is required' });
    }

    let queryText: string;
    let values: any[];

    if (name) {
      // Search by product name (case-insensitive partial match)
      logger.info(`Searching products by name: ${name}`);
      queryText = `
        SELECT
          ti.kodeitem AS id,
          ti.kodeitem AS barcode,
          ti.namaitem AS name,
          ts.stok,
          ti.hargajual1 AS price,
          ti.jenis AS category,
          ti.dateupd AS last_updated
        FROM
          tbl_item ti
        JOIN
          tbl_itemstok ts ON ti.kodeitem = ts.kodeitem
        WHERE
          LOWER(ti.namaitem) LIKE LOWER($1)
        ORDER BY
          ti.namaitem
      `;
      values = [`%${name}%`];
    } else {
      // Search by barcode (exact match)
      logger.info(`Searching products by barcode: ${barcode}`);
      queryText = `
        SELECT
          ti.kodeitem AS id,
          ti.kodeitem AS barcode,
          ti.namaitem AS name,
          ts.stok,
          ti.hargajual1 AS price,
          ti.jenis AS category,
          ti.dateupd AS last_updated
        FROM
          tbl_item ti
        JOIN
          tbl_itemstok ts ON ti.kodeitem = ts.kodeitem
        WHERE
          ti.kodeitem = $1
      `;
      values = [barcode];
    }

    const result = await pool.query(queryText, values);
    
    // Convert timestamp to string ISO 8601 and ensure numeric types
    const products: Product[] = result.rows.map(product => ({
      ...product,
      last_updated: product.last_updated ? new Date(product.last_updated).toISOString() : null,
      stock: product.stok !== null && product.stok !== undefined ? parseFloat(product.stok) : 0,
      price: parseFloat(product.price)
    }));
    
    logger.info(`Product search returned ${products.length} results`);
    res.json(products);

  } catch (error) {
    if (error instanceof Error) {
      logger.error('Product search error', { 
        error: error.message, 
        stack: error.stack,
        query: req.query
      });
    } else {
      logger.error('Product search unknown error');
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
