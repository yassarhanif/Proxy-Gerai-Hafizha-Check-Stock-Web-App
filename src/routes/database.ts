import { Router, Request, Response } from 'express';
import { testConnection } from '../services/db';
import logger from '../utils/logger';

const router = Router();

// Test database connection
router.get('/test-connection', async (req: Request, res: Response) => {
  try {
    const success = await testConnection();
    
    if (success) {
      logger.info('Database connection test endpoint called - successful');
      return res.json({ 
        success: true, 
        message: 'Database connection successful' 
      });
    } else {
      logger.error('Database connection test endpoint called - failed');
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to connect to the database' 
      });
    }
  } catch (error) {
    let errorMessage = 'Failed to connect to the database';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      logger.error('Database connection test endpoint error', {
        message: error.message,
        stack: error.stack
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});

export default router;
