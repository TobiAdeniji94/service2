const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');

// initialize WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const event = JSON.parse(message);
    console.log("Received event:", event);

    const filePathErrors = path.join(__dirname, '../public/errors.txt');
    const filePathInteractions = path.join(__dirname, '../public/interactions.txt');

    if (event.type === 'event.error') {
      console.log('Logging error:', event.data);
      fs.appendFile(filePathErrors, `${event.data}\n`, (err) => {
        if (err) console.error('Error writing to errors.txt:', err);
      });
    } else if (event.type === 'event.interaction') {
      console.log('Logging interaction:', event.data);
      fs.appendFile(filePathInteractions, `${event.data}\n`, (err) => {
        if (err) console.error('Error writing to interactions.txt:', err);
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// handler for Vercel serverless function
module.exports = async (req, res) => {
  // webSocket upgrades the request
  if (req.headers.upgrade === 'websocket') {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    // handle non-WebSocket requests
    res.status(200).send('WebSocket server is running');
  }
};
