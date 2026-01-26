const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (process.env.NODE_ENV === "production") {

        if (err.name === "ValidationError") {
            message = Object.values(err.errors).map(val => val.message).join(", ");
            statusCode = 400;
        }

        if (err.name === "CastError") {
            message = `Resource not found. Invalid: ${err.path}`;
            statusCode = 400;
        }

        if (err.code === 11000) {
            message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            statusCode = 400;
        }

        if (err.name === "JSONWebTokenError") {
            message = "JSON Web Token is invalid. Try again";
            statusCode = 401;
        }

        if (err.name === "TokenExpiredError") {
            message = "JSON Web Token has expired. Try again";
            statusCode = 401;
        }
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};

module.exports = ErrorHandler;