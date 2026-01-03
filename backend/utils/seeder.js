const connectDatabase = require('../config/database');
const products = require('../data/products.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');


dotenv.config({path:'BACKEND/config/config.env'});
connectDatabase();


const seedProducts = async () => {

    try {
        await Product.deleteMany();
        console.log("All Products Deleted !");

        await Product.insertMany(products);
        console.log("All Products Inserted !")
    }
    catch (err) {
        console.log(err.message);
    }
    process.exit();
}

seedProducts();