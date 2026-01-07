const app = require('./app');
const connectDatabase = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to DB first, then start the server. Fail fast with helpful message.
connectDatabase()
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