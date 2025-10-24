const https = require('https');
const http = require('http');

const HEAD_TARGET_URL = 'https://gyro-msg-tngr.onrender.com';
const POST_TARGET_URL = 'https://gyro-msg.onrender.com/auth/login';
const PING_APP2_URL = 'https://gyro-ping-app2.onrender.com'; // Change this after deploying APP2
const INTERVAL_MS = 2 * 60 * 1000; // 2 minutes
const PORT = process.env.PORT || 3000;

const LOGIN_PAYLOAD = JSON.stringify({
  email: "test@test.com",
  password: "123456"
});

// Simple HTTP server to receive pings from APP2
const server = http.createServer((req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Received ping from APP2`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('APP1 is alive');
});

server.listen(PORT, () => {
  console.log(`APP1 listening on port ${PORT}`);
});

function sendHeadRequest() {
  const url = new URL(HEAD_TARGET_URL);
  
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'HEAD',
    timeout: 10000
  };

  const req = https.request(options, (res) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] HEAD request sent to ${HEAD_TARGET_URL} - Status: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error sending HEAD request:`, error.message);
  });

  req.on('timeout', () => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] HEAD request timed out`);
    req.destroy();
  });

  req.end();
}

function sendPostRequest() {
  const url = new URL(POST_TARGET_URL);
  
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(LOGIN_PAYLOAD)
    },
    timeout: 10000
  };

  const req = https.request(options, (res) => {
    const timestamp = new Date().toISOString();
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log(`[${timestamp}] POST request sent to ${POST_TARGET_URL} - Status: ${res.statusCode}`);
    });
  });

  req.on('error', (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error sending POST request:`, error.message);
  });

  req.on('timeout', () => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] POST request timed out`);
    req.destroy();
  });

  req.write(LOGIN_PAYLOAD);
  req.end();
}

function pingApp2() {
  const url = new URL(PING_APP2_URL);
  
  const options = {
    hostname: url.hostname,
    path: '/',
    method: 'GET',
    timeout: 10000
  };

  const req = https.request(options, (res) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Pinged APP2 - Status: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error pinging APP2:`, error.message);
  });

  req.on('timeout', () => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] APP2 ping timed out`);
    req.destroy();
  });

  req.end();
}

function sendAllRequests() {
  sendHeadRequest();
  sendPostRequest();
  pingApp2();
}

// Send initial requests immediately
console.log('Starting ping service APP 1...');
console.log(`HEAD target: ${HEAD_TARGET_URL}`);
console.log(`POST target: ${POST_TARGET_URL}`);
console.log(`Pinging APP2: ${PING_APP2_URL}`);
console.log('Sending requests every 2 minutes...\n');
sendAllRequests();

// Set up interval for subsequent requests
setInterval(sendAllRequests, INTERVAL_MS);