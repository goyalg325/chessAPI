const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const chessRoutes = require('./routes/chessRoutes'); // Import the Chess API routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// MongoDB connection (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost/your-db-name', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// JWT configuration
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'; // Replace with your secret key

// Passport configuration (if needed)
// passport.use(new YourStrategy()); // Configure Passport strategies

// Use the Chess API routes
app.use('/chess', chessRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
