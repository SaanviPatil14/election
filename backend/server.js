const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables immediately
dotenv.config();

// Connect Database
// This is a crucial step. We'll make sure the database is connected
// before proceeding to set up the Express app.
connectDB();

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define Routes
app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/voters', require('./routes/voter'));
app.use('/api/candidates', require('./routes/candidate'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/results', require('./routes/results'));

const PORT = process.env.PORT || 5000;

// Only start the server after the database connection is ready
// This is a critical change. It prevents Express from starting
// and processing requests before Mongoose is fully initialized.
// Mongoose.connection.once('open') is the event listener for a successful connection.
mongoose.connection.once('open', () => {
    console.log('Mongoose connection successful. Starting server...');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});

// Add an error handler for unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Logged Error: ${err.message}`);
    process.exit(1);
});