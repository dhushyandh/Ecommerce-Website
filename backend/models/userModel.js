const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Pleqase enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        maxlength: [6, "Password cannot exceed 6 characters"],
        select: false
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }

})
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}


userSchema.methods.isValidPassword = async function (enteredPassword) {
    return  bcrypt.compare(enteredPassword, this.password);

}

userSchema.methods.getResetToken = function () {
    // Generate a random token
    const token = crypto.randomBytes(20).toString('hex');

    // Hash the token and set it to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    //set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;  // 30 MIN

    return token;

}

let model = mongoose.model('User', userSchema);

module.exports = model;