const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); 
const app = express();

connectDB();

app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/voters', require('./routes/voter'));
app.use('/api/candidates', require('./routes/candidate'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/results', require('./routes/results'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));