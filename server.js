const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a connection to MySQL
const con = mysql.createConnection({
  host: 'localhost',  // MySQL server address
  user: 'root',       // MySQL username
  password: 'root',   // MySQL password
  database: 'insulin_indulgence_2'  // Your database name
});

// Connect to MySQL
con.connect(function (err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

// Registration Route
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  con.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      return res.status(400).send('User already exists');
    }

    // Hash the password before saving
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Internal Server Error');
      }

      // Save user to the database
      const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      con.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting user into database:', err);
          return res.status(500).send('Internal Server Error');
        }

        res.status(200).send('Registration successful!');
      });
    });
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Query the database to find the user with the given email
  con.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Internal Server Error');
    }

    // If no user is found with the provided email
    if (results.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = results[0]; // The user object returned from the database

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (!isMatch) {
        return res.status(400).send('Incorrect password');
      }

      // If password matches, send success response (or redirect, etc.)
      res.status(200).send('Login successful!');
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
