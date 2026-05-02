const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const { app } = require('./src/app');
const { initSocket } = require('./src/sockets/server.socket'); 
const connectToDb = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer); 

connectToDb().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} already in use!`);
            process.exit(1);
        } else {
            console.error(err);
        }
    });
});