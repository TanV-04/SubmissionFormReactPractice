
// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ar@10Qg',
  database: 'trial'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Endpoint to validate user
app.post('/validate', (req, res) => {
  const { email, password } = req.body;

  // Check email and password in the database
  const query = 'SELECT * FROM credentials WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error' });
    }

    // 401 unauthorized error will be thrown by this code block
    if (results.length > 0) {
      res.status(200).json({ valid: true });
    } else {
      res.status(401).json({ valid: false, message: 'Invalid email or password' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
