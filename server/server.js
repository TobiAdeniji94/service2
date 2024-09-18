const fs = require('fs');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

// Define file paths
const errorsFilePath = path.join(__dirname, 'errors.txt');
const interactionsFilePath = path.join(__dirname, 'interactions.txt');

// Create HTTP server to serve the HTML and text files
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve the HTML file
    const filePath = path.join(__dirname, '../public/index.html');
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
    // Serve the errors.txt file as a downloadable file
    fs.access(errorsFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404);
        res.end('errors.txt not found');
        return;
      }
      fs.readFile(errorsFilePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading errors.txt');
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename="errors.txt"'
          });
          res.end(content);
        }
      });
    });
  } else if (req.url === '/interactions.txt') {
    // Serve the interactions.txt file as a downloadable file
    fs.access(interactionsFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404);
        res.end('interactions.txt not found');
        return;
      }
      fs.readFile(interactionsFilePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading interactions.txt');
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename="interactions.txt"'
          });
          res.end(content);
        }
      });
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Set up WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });
console.log("WebSocket server started");

// WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const event = JSON.parse(message);
    console.log("Received event:", event);

    const logMessage = `${event.type}: ${event.data}\n`;

    if (event.type === 'event.error') {
      console.log('Logging error to errors.txt:', event.data);
      fs.appendFile(errorsFilePath, logMessage, (err) => {
        if (err) {
          console.error('Error writing to errors.txt:', err);
        }
      });
    } else if (event.type === 'event.interaction') {
      console.log('Logging interaction to interactions.txt:', event.data);
      fs.appendFile(interactionsFilePath, logMessage, (err) => {
        if (err) {
          console.error('Error writing to interactions.txt:', err);
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
