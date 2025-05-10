const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

// Initialize app and middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'job_portal'
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.error('Could not connect to database:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Register endpoint
app.post('/api/register', (req, res) => {
    const { username, full_name, email, user_type, password } = req.body;

    if (!username || !full_name || !email || !user_type || !password) {
        return res.json({ success: false, message: 'Please fill all fields.' });
    }

    const query = `INSERT INTO users (username, full_name, email, user_type, password) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [username, full_name, email, user_type, password], (err, result) => {
        if (err) {
            console.error('Error in query execution:', err);
            return res.json({ success: false, message: 'Registration failed. Please try again.' });
        }
        
        res.json({ success: true, message: 'User registered successfully.' });
    });
});
// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;  // username here = email

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide both email and password' });
  }

  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Login query error:', err);
      return res.status(500).json({ error: 'Server error during login' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login successful → send user data (omit password in response)
    const user = results[0];
    delete user.password;  // remove password before sending

    res.json({
      message: 'Login successful',
      user,
      token: 'dummy-token-for-now' // Placeholder token (can replace with real JWT later)
    });
  });
});


// Start server
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
