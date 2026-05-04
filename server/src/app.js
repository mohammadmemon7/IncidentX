const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const userRoutes = require('./routes/users');
const ingestRoutes = require('./routes/ingest');
const statusRoutes = require('./routes/status');
const monitorRoutes = require('./routes/monitors');
const config = require('./config/config');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.static('./public'));

app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_CALLBACK_URL,
  proxy: true,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));


app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ingest', ingestRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/monitors', monitorRoutes);


app.get('/', (req, res) => {
  res.send('Incident X API is running');
});

module.exports =  app ;