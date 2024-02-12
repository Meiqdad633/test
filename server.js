// server.js

const express = require('express');
const pool = require('./config/dbConfig'); // Import the MySQL connection pool
const app = express();
const PORT = process.env.PORT || 5000;

// Endpoint to fetch all customers
app.get('/api/customers', (req, res) => {
  const sql = 'SELECT * FROM customers'; // Assuming your table name is 'customers'
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch details of a specific customer by ID
app.get('/api/customers/:id', (req, res) => {
  const customerId = req.params.id;
  const sql = 'SELECT * FROM customers WHERE id = ?';
  pool.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching customer:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(results[0]); // Return the first (and only) customer record
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
