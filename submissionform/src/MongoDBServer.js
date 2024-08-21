const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'submissionForm';

// Create MongoDB client
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

// Connect to MongoDB
client.connect(err => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the process if connection fails
  }
  db = client.db(dbName);
  console.log('Connected to MongoDB database');
});

// Endpoint to validate user
app.post('/validate', (req, res) => {
  if (!db) {
    return res.status(500).json({ message: 'Database not connected' });
  }

  const { email, password } = req.body;
  const query = { email: email, password: password };

  db.collection('credentials').find(query).toArray((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error' });
    }

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
