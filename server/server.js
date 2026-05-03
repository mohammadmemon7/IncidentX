const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/sockets/server.socket'); 
const { startMonitorCron } = require('./src/cron/monitorCron');
const connectToDb = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer); 

connectToDb().then(() => {
    console.log('Post-DB initialization starting...');
    startMonitorCron();
    httpServer.listen(PORT, () => {
        console.log(`🚀 IncidentX Server is running on port ${PORT}`);
        console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} already in use!`);
            process.exit(1);
        } else {
            console.error(err);
        }
    });
});
