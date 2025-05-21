import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5444'),
  database: process.env.DB_NAME || 'i5_Test',
  user: process.env.DB_USER || 'sysi5adm',
  password: process.env.DB_PASSWORD || 'u&aV23cc.o82dtr1x89c',
});

// Log pool events
pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  logger.error('PostgreSQL pool error', { error: err.message, stack: err.stack });
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    logger.info('Database connection test successful');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Database connection test failed', { 
        error: error.message, 
        stack: error.stack,
        connectionDetails: {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5444'),
          database: process.env.DB_NAME || 'i5_Test',
          user: process.env.DB_USER || 'sysi5adm'
        }
      });
    } else {
      logger.error('Database connection test failed with unknown error');
    }
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Export the pool for use in other modules
export default pool;
