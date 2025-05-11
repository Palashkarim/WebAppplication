const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the db connection
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, full_name, email, user_type, password } = req.body;

  if (!username || !full_name || !email || !user_type || !password) {
    return res.json({ success: false, message: 'Please fill all fields.' });
  }

  console.log('Checking if username or email exists...');

  try {
    const [results] = await db.query(
      `SELECT * FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (results.length > 0) {
      return res.json({ success: false, message: 'Username or email already exists.' });
    }

    const [insertResult] = await db.query(
      `INSERT INTO users (username, full_name, email, user_type, password) VALUES (?, ?, ?, ?, ?)`,
      [username, full_name, email, user_type, password]
    );

    console.log('User registered:', insertResult);
    res.json({ success: true, message: 'User registered successfully.' });

  } catch (err) {
    console.error('Database error during registration:', err);
    res.json({ success: false, message: 'Server error, please try again.' });
  }
});

// Login route (FIXED ✅)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide both email and password' });
  }

  try {
    const [results] = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [username]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    // Simple password check (in real app → hash it!)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Remove password before sending
    delete user.password;

    res.json({
      success: true,
      message: 'Login successful',
      user
    });

  } catch (err) {
    console.error('Database error during login:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});
// API Endpoint to post a job
app.post('/api/jobs', (req, res) => {
  const { employer_id, title, description, location, type, salary, experience_level } = req.body;

  if (!employer_id || !title || !description || !location || !type || !salary || !experience_level) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const posted_at = new Date();  // auto timestamp

  const sql = `INSERT INTO jobs (employer_id, title, description, location, type, salary, experience_level, posted_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [employer_id, title, description, location, type, salary, experience_level, posted_at];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting job:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Job posted successfully', jobId: result.insertId });
  });
});


// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
