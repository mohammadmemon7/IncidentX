const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const userRoutes = require('./routes/users');
const ingestRoutes = require('./routes/ingest');
const statusRoutes = require('./routes/status');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ingest', ingestRoutes);
app.use('/api/status', statusRoutes);


app.get('/', (req, res) => {
  res.send('Incident X API is running');
});

module.exports = { app };