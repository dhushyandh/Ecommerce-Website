const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const passport = require("passport");



// Load env variables
dotenv.config({ path: path.join(__dirname, "config/config.env") });

require("./config/passport");

// Models
require("./models/userModel");
require("./models/productModel");
require("./models/orderModel");

// Routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const payment = require("./routes/payment");
const errorMiddleware = require("./middlewares/error");
const authRoutes = require("./routes/authRoutes");

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Uploads (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/auth", authRoutes);


if (process.env.NODE_ENV === "production") {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get('/manifest.json', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/manifest.json'));
  });

  app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/service-worker.js'));
  });

  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });

}

app.use(errorMiddleware);

module.exports = app;
