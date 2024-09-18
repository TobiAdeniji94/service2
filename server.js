const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

// Create an instance of express
const app = express();

// Define file paths
const logFolder = path.join(__dirname, 'logs');
const errorsFilePath = path.join(logFolder, 'errors.txt');
const interactionsFilePath = path.join(logFolder, 'interactions.txt');
const htmlFilePath = path.join(__dirname, 'public', 'index.html');

if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder);
}


// Serve the static HTML file for the front end
app.get('/', (req, res) => {
  res.sendFile(htmlFilePath);
});

// Endpoint to download errors.txt file
app.get('/errors.txt', (req, res) => {
  fs.access(errorsFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('errors.txt not found');
    }
    res.download(errorsFilePath, 'errors.txt', (err) => {
      if (err) {
        res.status(500).send('Error downloading errors.txt');
      }
    });
  });
});

// Endpoint to download interactions.txt file
app.get('/interactions.txt', (req, res) => {
  fs.access(interactionsFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('interactions.txt not found');
    }
    res.download(interactionsFilePath, 'interactions.txt', (err) => {
      if (err) {
        res.status(500).send('Error downloading interactions.txt');
      }
    });
  });
});

// Create HTTP server and pass express app to it
const server = http.createServer(app);

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
