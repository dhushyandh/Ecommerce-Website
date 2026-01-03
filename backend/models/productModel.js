const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true, "Please Enter Product Name"],
        trim : true,
        maxLength : [100,"Product name cannot exceed 100 characters" ]
    },
    price: {
        type: Number,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "please enter product description"]
    },
    ratings:{
        type: Number,
        default: 0
    },
    images:[
        {
            image:{
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required: [true,"please enter product category"],
        enum: {
            values: [
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: "Please Select correct category"
        }
    },
    seller:{
        type: String,
        required: [true,"Please enter product seller"]
    },
    stock:{
        type: Number,
        required:[true,"please enter product stock"],
        maxlength: [10,'Product stock cannot exceed the limit']
    },
    numOfReviews:{
        type: Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:  mongoose.Schema.Types.ObjectId,
                ref: 'User',
                
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }

})

let schema =  mongoose.model('product', productSchema);

module.exports = schema;