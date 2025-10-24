# Gyro Ping Service

A simple Node.js service that sends requests every 2 minutes to keep servers alive:
- HEAD request to https://gyro-msg-tngr.onrender.com
- POST request to https://gyro-msg.onrender.com/auth/login

## Features

- Sends HEAD request to gyro-msg-tngr.onrender.com every 2 minutes
- Sends POST request to gyro-msg.onrender.com/auth/login every 2 minutes
- No external dependencies (uses only Node.js built-in modules)
- Timestamped logging
- Error handling and timeout protection

## Installation

```bash
npm install
```

(No dependencies needed, but this command ensures the setup is valid)

## Usage

```bash
npm start
```

Or directly:

```bash
node index.js
```

## Deployment

### Deploy to Render.com

1. Push this code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: gyro-ping-service
   - **Environment**: Node
   - **Build Command**: (leave empty)
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Click "Create Web Service"

### Deploy to Heroku

```bash
heroku create gyro-ping-service
git push heroku main
```

### Deploy to Railway

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js and deploy

### Deploy to Fly.io

```bash
fly launch
fly deploy
```

## Environment Variables

No environment variables required. URLs and credentials are hardcoded in `index.js`.

To change settings, edit the constants in `index.js`:
- `HEAD_TARGET_URL`: The URL for HEAD requests
- `POST_TARGET_URL`: The URL for POST requests
- `LOGIN_PAYLOAD`: The login credentials
- `INTERVAL_MS`: Interval in milliseconds (default: 120000 = 2 minutes)

## Requirements

- Node.js >= 14.0.0
