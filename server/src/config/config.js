const dotenv = require('dotenv');
dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
}
if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined');
}
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not defined');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET is not defined');
}
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV is not defined');
}
if (!process.env.GOOGLE_CALLBACK_URL) {
    throw new Error('GOOGLE_CALLBACK_URL is not defined');
}

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
}