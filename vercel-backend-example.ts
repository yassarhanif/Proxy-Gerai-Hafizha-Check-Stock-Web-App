// Example file showing how to update your Vercel backend to use the proxy API
import axios from 'axios';
import { Request, Response } from 'express';

// Get the proxy API URL from environment variables
const PROXY_API_URL = process.env.PROXY_API_URL || 'https://your-machine-name.tailnet-name.ts.net:3002';

// Test database connection
export async function testDatabaseConnection(req: Request, res: Response) {
  try {
    // Instead of connecting directly to the database, call the proxy API
    const response = await axios.get(`${PROXY_API_URL}/api/database/test-connection`);
    
    // Return the response from the proxy API
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error testing database connection:', error);
    
    // Handle errors
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to connect to the proxy API' 
    });
  }
}

// Search products by name or barcode
export async function searchProducts(req: Request, res: Response) {
  try {
    const { name, barcode } = req.query;
    
    // Instead of querying the database directly, call the proxy API
    const response = await axios.get(`${PROXY_API_URL}/api/products/search`, {
      params: { name, barcode }
    });
    
    // Return the response from the proxy API
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error searching products:', error);
    
    // Handle errors
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    return res.status(500).json({ error: 'Failed to search products via proxy API' });
  }
}

// Example of how to use these functions in your Express routes
/*
import express from 'express';
const router = express.Router();

router.get('/database/test-connection', testDatabaseConnection);
router.get('/products/search', searchProducts);

export default router;
*/
