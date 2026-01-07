const app = require('./app');
const path = require('path');


let connectDatabase;
try {
    const dbMod = require(path.join(__dirname, 'config', 'database.js'));
    if (typeof dbMod === 'function') connectDatabase = dbMod;
    else if (dbMod && typeof dbMod.default === 'function') connectDatabase = dbMod.default;
    else if (dbMod && typeof dbMod.connectDatabase === 'function') connectDatabase = dbMod.connectDatabase;
    else connectDatabase = undefined;
} catch (err) {
    console.error('Error loading database module:', err && err.message);
    connectDatabase = undefined;
}

const PORT = process.env.PORT || 5000;

// Ensure we never call `.then` on undefined. Wrap the connector in a Promise
// so deployments with unexpected module shapes fail with a clear message
// instead of a TypeError.
let dbPromise;
try {
    if (typeof connectDatabase === 'function') {
        dbPromise = Promise.resolve(connectDatabase());
    } else {
        const err = new Error('connectDatabase is not a function. Check backend/config/database.js export.');
        console.error(err.message);
        dbPromise = Promise.reject(err);
    }
} catch (err) {
    console.error('Error while calling connectDatabase():', err && err.message);
    dbPromise = Promise.reject(err);
}

dbPromise
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`MY Server Listening to the port ${PORT} in ${process.env.NODE_ENV || 'development'} Mode`);
        });

        // graceful shutdown handlers
        process.on('unhandledRejection', (err) => {
            console.error(`Unhandled Rejection: ${err && err.message}`);
            server.close(() => process.exit(1));
        });

        process.on('uncaughtException', err => {
            console.error(`Uncaught Exception: ${err && err.message}`);
            server.close(() => process.exit(1));
        });
    })
    .catch(err => {
        console.error('Failed to connect to database:', err && err.message);
        process.exit(1);
    });
// Note: additional global handlers are registered above within the server start
// to ensure `server` is in scope. Any startup failures (e.g. DB connect) will
// have been logged and the process exited in the catch above.