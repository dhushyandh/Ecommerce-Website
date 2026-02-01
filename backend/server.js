const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");


dotenv.config({ path: "./config/config.env" });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Start server function
const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.log(`ERROR: ${err.message}`);
      console.log("Shutting down server due to unhandled promise rejection");

      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();