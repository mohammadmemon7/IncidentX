const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ingest', require('./routes/ingest'));
app.use('/api/status', require('./routes/status'));

app.get('/', (req, res) => {
  res.send('Incident X API is running');
});

module.exports = { app };