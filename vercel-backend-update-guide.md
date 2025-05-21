# Updating Your Vercel Backend to Use the Proxy API

This guide will help you update your Vercel-deployed backend to use the proxy API instead of trying to connect directly to the PostgreSQL database.

## Step 1: Get Your Tailscale Funnel URL

After setting up the proxy API and running Tailscale Funnel, you should have received a public URL. It will look something like:

```
https://your-machine-name.tailnet-name.ts.net:3002
```

or

```
https://your-custom-domain.com:3002
```

This is the URL that your Vercel backend will use to communicate with the proxy API.

## Step 2: Update Your Vercel Backend Code

### Option 1: Use Environment Variables (Recommended)

1. Go to your Vercel project settings
2. Navigate to the "Environment Variables" section
3. Add the following environment variable:
   - Name: `PROXY_API_URL`
   - Value: Your Tailscale Funnel URL (without the trailing slash)
   - Example: `https://your-machine-name.tailnet-name.ts.net:3002`

4. Update your backend code to use this environment variable for API calls instead of connecting directly to the database.

### Option 2: Modify Your Backend Code

If you prefer to modify your code directly, you'll need to:

1. Remove the direct database connection code
2. Replace it with HTTP requests to the proxy API endpoints

Here's an example of how to modify your code:

#### Before (Direct Database Connection):

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5444'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Example function to search products
export async function searchProducts(name) {
  const result = await pool.query(
    'SELECT * FROM tbl_item WHERE LOWER(namaitem) LIKE LOWER($1)',
    [`%${name}%`]
  );
  return result.rows;
}
```

#### After (Using Proxy API):

```typescript
import axios from 'axios';

const PROXY_API_URL = process.env.PROXY_API_URL || 'https://your-machine-name.tailnet-name.ts.net:3002';

// Example function to search products
export async function searchProducts(name) {
  try {
    const response = await axios.get(`${PROXY_API_URL}/api/products/search`, {
      params: { name }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}
```

## Step 3: Test Your Updated Backend

1. Deploy your updated backend to Vercel
2. Test the API endpoints to ensure they're working correctly
3. Verify that your frontend can communicate with the backend

## Troubleshooting

### CORS Issues

If you encounter CORS issues, make sure your proxy API is configured to allow requests from your frontend domain. The proxy API already has CORS enabled, but you may need to configure it for specific domains.

### Connection Timeouts

If your requests are timing out, check that:
1. Your proxy API is running
2. Tailscale Funnel is active
3. Your computer is powered on and connected to the internet

### API Endpoint Differences

Make sure the endpoints in your Vercel backend match the endpoints exposed by the proxy API:
- `/api/database/test-connection`
- `/api/products/search`
