const mysql = require('mysql2');

// Create a connection to MySQL
const con = mysql.createConnection({
  host: 'localhost',  // MySQL server address (localhost for local development)
  user: 'root',  // MySQL username (adjust if needed)
  password: 'root'  // MySQL password (adjust if needed)
});

// Connect to MySQL
con.connect(function (err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');

  // Create the 'insulin_indulgence' database if it doesn't exist
  con.query('CREATE DATABASE IF NOT EXISTS insulin_indulgence_2', function (err, result) {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database "insulin_indulgence_2" created or already exists');

    // Switch to the 'insulin_indulgence' database
    con.changeUser({ database: 'insulin_indulgence_2' }, function (err) {
      if (err) {
        console.error('Error selecting database:', err);
        return;
      }

      // Create the 'users' table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100) UNIQUE,
          password VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      con.query(createTableQuery, function (err, result) {
        if (err) {
          console.error('Error creating users table:', err);
          return;
        }
        console.log('Users table created or already exists');
      });
    });
  });
});
