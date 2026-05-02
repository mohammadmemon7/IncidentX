const dotenv = require('dotenv');
dotenv.config(); 

const { app, } = require('./src/app');

const http = require('http');
const connectToDb = require('./src/config/database');
const { initSocket } = require('./src/sockets/server.socket');

connectToDb();

const httpServer = http.createServer(app)
initSocket(httpServer)

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});