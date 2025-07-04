require('dotenv').config();

const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 5001;
const cors = require('cors');

app.use(express.json());
app.use(cors());

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', message => {
    console.log(`Received message: ${message}`);
    ws.send(`Echo: ${message}`); // Echo back the message
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', error => {
    console.error('WebSocket error:', error);
  });
});