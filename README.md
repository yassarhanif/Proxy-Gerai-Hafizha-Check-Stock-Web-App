# Gerai Hafizha Database Proxy API

This is a proxy API service that connects to the Gerai Hafizha PostgreSQL database and exposes API endpoints for the Vercel-deployed frontend to use.

## Why This Proxy Exists

The main Gerai Hafizha database is only accessible within a Tailscale VPN network. Since Vercel-deployed applications cannot directly connect to Tailscale networks, this proxy:

1. Runs on your local machine (which has Tailscale access to the database)
2. Exposes API endpoints that match the original backend
3. Is made publicly accessible via Tailscale Funnel
4. Allows the Vercel-deployed frontend to connect to the database indirectly

## Setup Instructions

### Prerequisites

1. Node.js (v14 or higher)
2. Tailscale installed and connected to your network
3. Access to the PostgreSQL database via Tailscale

### Installation

1. Clone or download this repository
2. Create a `.env` file based on `.env.example` with your database credentials
3. Install dependencies:
   ```
   npm install
   ```
4. Build the project:
   ```
   npm run build
   ```

### Running as a Service (Recommended)

To run the proxy as a Windows service that starts automatically on boot:

1. Install the service:
   ```
   npm run install-service
   ```
2. The service will start automatically

To uninstall the service:
```
npm run uninstall-service
```

### Running Manually

For development or testing:

```
npm run dev
```

For production:

```
npm run build
npm start
```

### Creating an Executable

To create a standalone executable:

```
npm run pkg
```

This will create an executable in the `bin` folder.

## Making the Proxy Publicly Accessible

To make the proxy accessible to your Vercel-deployed frontend:

1. Start the proxy service (either as a Windows service or manually)
2. Run the following command to expose it via Tailscale Funnel:
   ```
   tailscale funnel 3002
   ```
3. Tailscale will provide a public URL that you can use in your Vercel environment variables

## API Endpoints

- `GET /`: Returns a welcome message
- `GET /api/database/test-connection`: Tests the database connection
- `GET /api/products/search`: Searches for products by name or barcode

## Updating Your Vercel Backend

In your Vercel-deployed backend, update the environment variables to point to this proxy instead of trying to connect directly to the database.

## Troubleshooting

### Proxy Not Starting
- Check the logs in the `logs` directory
- Verify your database credentials in the `.env` file
- Make sure Tailscale is running and connected

### Cannot Access Proxy Publicly
- Verify Tailscale Funnel is running with `tailscale funnel status`
- Check your firewall settings
- Make sure port 3002 is not blocked

### Database Connection Issues
- Test the connection with the `/api/database/test-connection` endpoint
- Verify your Tailscale connection is active
- Check if the database server is running

## Logs

Logs are stored in the `logs` directory:
- `combined.log`: All logs
- `error.log`: Error logs only
