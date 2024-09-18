# service2

### service2 Documentation: WebSocket Logging Service

#### Overview

This service is a Node.js application that uses WebSockets to receive events from a frontend banking application. It logs these events into two separate text files, `errors.txt` and `interactions.txt`, and serves these files over HTTP for download.

#### Features

1. **WebSocket Server**: Listens for incoming WebSocket connections and messages.
2. **Event Logging**:
   - **Error Events**: Logged into `errors.txt`.
   - **Interaction Events**: Logged into `interactions.txt`.
3. **File Access**:
   - **Downloadable Files**: Provides HTTP endpoints to download the `errors.txt` and `interactions.txt` files.

#### Folder Structure

#### File Details

- **`server.js`**: The main server file which sets up the HTTP server, WebSocket server, and handles file logging.
- **`errors.txt`**: A text file where error events are logged.
- **`interactions.txt`**: A text file where interaction events are logged.
- **`public/index.html`**: The HTML page that interacts with the WebSocket server (created as part of the setup).

#### Setup and Execution

1. **Install Dependencies**:
   Ensure you have Node.js installed. Install the necessary npm packages:
   ```sh
   npm install ws
   ```

2. **Run the Server**:
   Start the server with:
   ```sh
   node server.js
   ```

3. **Access the Service**:
   - Open `http://localhost:3000/` to see and interact with the HTML page.
   - Use the WebSocket client to send messages.
   - Download the log files from `http://localhost:3000/errors.txt` and `http://localhost:3000/interactions.txt`.

#### Error Handling

- **500 Internal Server Error**: If there's an issue with reading the log files or starting the server, appropriate error messages will be shown.
- **404 Not Found**: If trying to access non-existent endpoints or files.

#### Notes

- Ensure that WebSocket connections are correctly established and that messages are in the expected format.
- Monitor server logs for any errors or issues related to file operations or WebSocket connections.