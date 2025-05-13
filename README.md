# Solana Counter dApp

A simple decentralized application built on Solana blockchain that demonstrates how to interact with a smart contract from a Next.js frontend.

## Project Structure

- `contract/`: Contains the Solana smart contract built with Anchor framework
- `frontend/`: Contains the Next.js frontend application

## Smart Contract

The smart contract is a simple counter program that allows users to:
- Initialize a new counter
- Increment the counter

## Prerequisites

- Node.js (v16 or higher)
- Yarn
- Solana CLI
- Anchor Framework
- A Solana wallet (Phantom, Solflare, etc.)

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/solana-counter.git
cd solana-counter
```

### 2. Install dependencies

```bash
# Install contract dependencies
cd contract
yarn install

# Install frontend dependencies
cd ../frontend
yarn install
```

### 3. Build and deploy the smart contract

```bash
cd contract
anchor build
anchor deploy
```

Note the program ID after deployment and update it in the frontend code if necessary.

### 4. Start the frontend

```bash
cd ../frontend
yarn dev
```

The application will be available at http://localhost:3000

## Using the Application

1. Connect your Solana wallet (make sure it's set to Devnet)
2. Initialize the counter (this will create a new counter account)
3. Increment the counter
4. View transaction details on Solana Explorer

## Technologies Used

- Solana Blockchain
- Anchor Framework
- Next.js
- React
- Tailwind CSS
- @solana/web3.js
- @solana/wallet-adapter

## License

MIT

# RideChain WebSocket Server

This is a simple WebSocket server for handling real-time updates in the RideChain carpooling application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

The server will run on port 3001 by default. You can change this by setting the `PORT` environment variable.

## Deployment

You can deploy this WebSocket server to various platforms:

### Heroku

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create ridechain-websocket-server

# Deploy to Heroku
git init
git add .
git commit -m "Initial commit"
git push heroku master
```

### Vercel

1. Create a `vercel.json` file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. Deploy to Vercel:

```bash
vercel
```

## Environment Variables

- `PORT`: The port on which the server will run (default: 3001)

## Frontend Configuration

In your frontend application, set the WebSocket URL in your environment variables:

```
NEXT_PUBLIC_WEBSOCKET_URL=https://your-websocket-server-url.com
```
