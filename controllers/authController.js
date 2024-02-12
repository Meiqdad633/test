// authController.js
const bcrypt = require('bcrypt');
const connection = require('./config/dbConfig');

exports.register = (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash password

  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  connection.query(sql, [username, hashedPassword], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to register user' });
      return;
    }
    res.json({ message: 'User registered successfully' });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to authenticate' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    res.json({ message: 'Login successful' });
  });
};
