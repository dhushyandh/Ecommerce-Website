const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config({path:path.join(__dirname,"config/config.env")});


require('./models/userModel');
require('./models/productModel');
require('./models/orderModel');

// ROUTES
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require('./routes/payment');
const errorMiddleware = require('./middlewares/error');

app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use('/api/v1/', products);
app.use('/api/v1/', auth);
app.use('/api/v1/', order);
app.use('/api/v1/', payment);

if(process.env.NODE_ENV === 'production'){
    // Serve static assets from the React build
    app.use('/static', express.static(path.join(__dirname, '../frontend/build/static'), { maxAge: '1d' }));
    // Fallback explicit handlers to set correct MIME types in case host overrides them
    app.get('/static/js/:file', (req, res) => {
        const filePath = path.join(__dirname, '../frontend/build/static/js', req.params.file);
        res.type('application/javascript');
        res.sendFile(filePath, err => {
            if (err) res.status(err.status || 404).end();
        });
    });
    app.get('/static/css/:file', (req, res) => {
        const filePath = path.join(__dirname, '../frontend/build/static/css', req.params.file);
        res.type('text/css');
        res.sendFile(filePath, err => {
            if (err) res.status(err.status || 404).end();
        });
    });
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // Explicitly serve common root assets to avoid 404/mime issues on some hosts
    app.get('/manifest.json', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/manifest.json'));
    });

    app.get('/service-worker.js', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/service-worker.js'));
    });

    // Fallback: serve index.html for any other route
    app.get(/.*/,(req,res)=>{
        res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'))
    })
}

app.use(errorMiddleware);

module.exports = app;
