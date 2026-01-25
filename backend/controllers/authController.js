const catchAsyncError = require('../middlewares/catchAsyncError')
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// RegisterUser -- {{base_url}}/api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body


    let avatar;

    let BASE_URL = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.filename}`
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user, 201, res);

});

// LoginUser -- {{base_url}}/api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400));
    }

    // Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    if (!(await user.isValidPassword(password))) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 201, res);

})

// LogoutUser -- {{base_url}}/api/v1/logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

// ForgetPassword -- {{base_url}}/api/v1/password/forget
exports.forgetPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false });

    let BASE_URL = process.env.FRONTEND_URL;

    if (process.env.NODE_ENV === 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    // Create reset url
    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

    const message = `Your password url token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message

        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully !`
        })
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
})

// ResetPassword -- {{base_url}}/api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });

    sendToken(user, 201, res);
});

// Get User Profile -- {{base_url}}/api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })

})

// Change Password -- {{base_url}}/api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check old password
    if (!(await user.isValidPassword(req.body.oldPassword))) {
        return next(new ErrorHandler(`Old Password is incorrect`, 401))
    }
    // assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success: true
    })
})

// Update Profile -- {{base_url}}/api/v1/profile/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    if (req.file) console.log('[authController.updateProfile] file=', req.file.filename);
    let newUserData = { name: req.body.name };

    if (req.body.email) {
        const existing = await User.findOne({ email: req.body.email });

        if (existing && existing._id.toString() !== req.user.id) {
            return next(new ErrorHandler('Email is already in use by another account', 400));
        }
        newUserData.email = req.body.email;
    }

    let avatar;
    let BASE_URL = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.filename}`
        newUserData = { ...newUserData, avatar }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        user
    })
})

// ADMIN ROUTES : Get All users -- {{base_url}}/api/v1/admin/users

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

// ADMIN ROUTES : Get Single user -- {{base_url}}/api/v1/admin/user/:id

exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with this id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user
    })
})

// ADMIN ROUTES : Update User Role -- {{base_url}}/api/v1/admin/user/:id

exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    console.log('[authController.updateUserRole] req.user.id=', req.user && req.user.id, 'req.params.id=', req.params.id);
    console.log('[authController.updateUserRole] body=', req.body);
    if (req.file) console.log('[authController.updateUserRole] file=', req.file.filename);
    const newUserData = { name: req.body.name, role: req.body.role };

    // If email provided, ensure it's not already used by another user
    if (req.body.email) {
        const existing = await User.findOne({ email: req.body.email });
        if (existing && existing._id.toString() !== req.params.id) {
            return next(new ErrorHandler('Email is already in use by another account', 400));
        }
        newUserData.email = req.body.email;
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({
        success: true,
        user
    })
})

// ADMIN ROUTES : Delete User -- {{base_url}}/api/v1/admin/user/:id

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with this id: ${req.params.id}`, 404));
    }
    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
})
