// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const http = require('http');
// const WebSocket = require('ws');

// // Create an instance of express
// const app = express();

// // Define file paths
// const logFolder = path.join(__dirname, 'logs');
// const errorsFilePath = path.join(logFolder, 'errors.txt');
// const interactionsFilePath = path.join(logFolder, 'interactions.txt');
// const htmlFilePath = path.join(__dirname, 'public', 'index.html');

// if (!fs.existsSync(logFolder)) {
//   fs.mkdirSync(logFolder);
// }


// // Serve the static HTML file for the front end
// app.get('/', (req, res) => {
//   res.sendFile(htmlFilePath);
// });

// // Endpoint to download errors.txt file
// app.get('/errors.txt', (req, res) => {
//   fs.access(errorsFilePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       return res.status(404).send('errors.txt not found');
//     }
//     res.download(errorsFilePath, 'errors.txt', (err) => {
//       if (err) {
//         res.status(500).send('Error downloading errors.txt');
//       }
//     });
//   });
// });

// // Endpoint to download interactions.txt file
// app.get('/interactions.txt', (req, res) => {
//   fs.access(interactionsFilePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       return res.status(404).send('interactions.txt not found');
//     }
//     res.download(interactionsFilePath, 'interactions.txt', (err) => {
//       if (err) {
//         res.status(500).send('Error downloading interactions.txt');
//       }
//     });
//   });
// });

// // Create HTTP server and pass express app to it
// const server = http.createServer(app);

// // Set up WebSocket server on top of the HTTP server
// const wss = new WebSocket.Server({ server });
// console.log("WebSocket server started");

// // WebSocket connection logic
// wss.on('connection', (ws) => {
//   console.log('New client connected');

//   ws.on('message', (message) => {
//     const event = JSON.parse(message);
//     console.log("Received event:", event);

//     const logMessage = `${event.type}: ${event.data}\n`;

//     if (event.type === 'event.error') {
//       console.log('Logging error to errors.txt:', event.data);
//       fs.appendFile(errorsFilePath, logMessage, (err) => {
//         if (err) {
//           console.error('Error writing to errors.txt:', err);
//         }
//       });
//     } else if (event.type === 'event.interaction') {
//       console.log('Logging interaction to interactions.txt:', event.data);
//       fs.appendFile(interactionsFilePath, logMessage, (err) => {
//         if (err) {
//           console.error('Error writing to interactions.txt:', err);
//         }
//       });
//     }
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const WebSocket = require('ws');

// // Create an Express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Set up WebSocket server on top of HTTP server
// const server = require('http').createServer(app);
// const wss = new WebSocket.Server({ server });

// // Directory where logs will be stored
// const logsDir = path.join(__dirname, 'logs');
// const htmlFilePath = path.join(__dirname, 'public', 'index.html');


// // Ensure logs directory exists
// if (!fs.existsSync(logsDir)) {
//     fs.mkdirSync(logsDir);
// }

// // WebSocket connection logic
// wss.on('connection', (ws) => {
//     console.log('New client connected');

//     ws.on('message', (message) => {
//         const event = JSON.parse(message);
//         console.log("Received event:", event);

//         const logMessage = `${event.type}: ${event.data}\n`;
//         const logFileName = event.type === 'event.error' ? 'errors.txt' : 'interactions.txt';
//         const logFilePath = path.join(logsDir, logFileName);

//         // Append message to corresponding log file
//         fs.appendFileSync(logFilePath, logMessage, (err) => {
//             if (err) console.error('Error writing to log file:', err);
//         });
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

// // Serve the static HTML file for the front end
// app.get('/', (req, res) => {
//   res.sendFile(htmlFilePath);
// });

// // Route to download and delete the log file
// app.get('/download/:type', (req, res) => {
//     const { type } = req.params;
//     const fileName = type === 'error' ? 'errors.txt' : 'interactions.txt';
//     const filePath = path.join(logsDir, fileName);

//     // Check if the file exists
//     fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//             return res.status(404).send(`${fileName} not found`);
//         }

//         // Serve the file for download and delete after sending
//         res.download(filePath, fileName, (downloadErr) => {
//             if (downloadErr) {
//                 console.error('Error during file download:', downloadErr);
//             } else {
//                 // Delete the file after download
//                 fs.unlink(filePath, (unlinkErr) => {
//                     if (unlinkErr) {
//                         console.error('Error deleting file:', unlinkErr);
//                     } else {
//                         console.log(`${fileName} deleted after download.`);
//                     }
//                 });
//             }
//         });
//     });
// });

// // Start the server
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Define file paths
const logsDir = path.join(__dirname, 'logs');
const errorsFilePath = path.join(logsDir, 'errors.txt');
const interactionsFilePath = path.join(logsDir, 'interactions.txt');
const htmlFilePath = path.join(__dirname, 'public', 'index.html');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Serve the HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// });

// Serve the static HTML file for the front end
app.get('/', (req, res) => {
  res.sendFile(htmlFilePath);
});

// Serve log files for download
app.get('/errors.txt', (req, res) => {
  console.log(`Attempting to serve ${errorsFilePath}`);
    fs.access(errorsFilePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log('errors.txt not found');
            return res.status(404).send('errors.txt not found');
        }
        res.download(errorsFilePath, 'errors.txt', (downloadErr) => {
            if (downloadErr) {
                console.error('Error during file download:', downloadErr);
            } else {
                // Optionally delete the file after download
                fs.unlink(errorsFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting errors.txt:', unlinkErr);
                    } else {
                        console.log('errors.txt deleted after download.');
                    }
                });
            }
        });
    });
});

app.get('/interactions.txt', (req, res) => {
  console.log(`Attempting to serve ${interactionsFilePath}`);
    fs.access(interactionsFilePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log('interactions.txt not found');
            return res.status(404).send('interactions.txt not found');
        }
        res.download(interactionsFilePath, 'interactions.txt', (downloadErr) => {
            if (downloadErr) {
                console.error('Error during file download:', downloadErr);
            } else {
                // Optionally delete the file after download
                fs.unlink(interactionsFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting interactions.txt:', unlinkErr);
                    } else {
                        console.log('interactions.txt deleted after download.');
                    }
                });
            }
        });
    });
});

// Set up WebSocket server on top of the HTTP server
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const event = JSON.parse(message);
        console.log("Received event:", event);

        const logMessage = `${event.type}: ${event.data}\n`;
        const logFileName = event.type === 'event.error' ? 'errors.txt' : 'interactions.txt';
        const logFilePath = path.join(logsDir, logFileName);

        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                console.error(`Error writing to ${logFileName}:`, err);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
