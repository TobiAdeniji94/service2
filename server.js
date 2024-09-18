const express = require('express');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Initialize Express app
const app = express();

// Define file paths
const logFolder = path.join(__dirname, 'logs');
const errorsFilePath = path.join(logFolder, 'errors.txt');
const interactionsFilePath = path.join(logFolder, 'interactions.txt');

if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder);
}

// Serve static HTML page from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for downloading errors.txt
app.get('/errors.txt', (req, res) => {
  res.download(errorsFilePath, 'errors.txt', (err) => {
    if (err) {
      res.status(500).send('Error downloading errors.txt');
    }
  });
});

// Route for downloading interactions.txt
app.get('/interactions.txt', (req, res) => {
  res.download(interactionsFilePath, 'interactions.txt', (err) => {
    if (err) {
      res.status(500).send('Error downloading interactions.txt');
    }
  });
});

// Start the server and WebSocket on the same port
const server = require('http').createServer(app);

// Initialize WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const event = JSON.parse(message);
    console.log('Received event:', event);

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
  console.log(`Server running on port ${PORT}`);
});
