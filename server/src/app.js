const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));


// Socket.io Setup
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-incident', (incidentId) => {
    socket.join(`incident:${incidentId}`);
    console.log(`User joined incident room: incident:${incidentId}`);
  });

  socket.on('join-admin', () => {
    socket.join('admin');
    console.log('User joined admin room');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ingest', require('./routes/ingest'));
app.use('/api/status', require('./routes/status'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Incident X API is running');
});


module.exports = { app, server };