const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: path.join(__dirname, "config/config.env") });

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

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Uploads (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// =======================
// PRODUCTION (VITE BUILD)
// =======================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../frontend/dist/index.html")
    );
  });
}

// Error middleware (LAST)
app.use(errorMiddleware);

module.exports = app;
