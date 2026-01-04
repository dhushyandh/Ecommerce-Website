const app = require('./app');
const connectDatabase = require('./config/database');


connectDatabase();


const server = app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`MY Server Listening to the port ${process.env.PORT} in ${process.env.NODE_ENV} Mode`)
})

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    });
})

process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    server.close(() => {
        process.exit(1);
    });
})