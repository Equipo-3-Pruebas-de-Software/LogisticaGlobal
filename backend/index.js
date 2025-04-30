// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');

// Middleware
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});