const mongoose = require('mongoose');
const config = require('./config');

/**
 * Connects to the MongoDB database using the MONGO_URI from the config file.
 */
const connectToDb = async () => {
    await mongoose.connect(config.MONGO_URI);
    console.log("Database connected successfully");
    
};

module.exports = connectToDb;