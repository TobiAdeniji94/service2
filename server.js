const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Create HTTP server to serve the HTML and text files
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve the HTML file
    const filePath = path.join(__dirname, 'public/index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading HTML page');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.url === '/errors.txt') {
    // Serve the errors.txt file
    const filePath = path.join(__dirname, 'errors.txt');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading errors.txt');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(content);
      }
    });
  } else if (req.url === '/interactions.txt') {
    // Serve the interactions.txt file
    const filePath = path.join(__dirname, 'interactions.txt');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading interactions.txt');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// WebSocket setup
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const event = JSON.parse(message);
    if (event.type === 'event.error') {
      fs.appendFileSync('errors.txt', `${event.data}\n`);
    } else if (event.type === 'event.interaction') {
      fs.appendFileSync('interactions.txt', `${event.data}\n`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
