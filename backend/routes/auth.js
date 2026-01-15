const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = path.join(__dirname, '..', 'uploads', 'user');
            try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})

const { registerUser,
    loginUser,
    logoutUser,
    forgetPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateProfile,
    updateUserRole,
    getAllUsers,
    getUser,
    deleteUser
} = require('../controllers/authController');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate')

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forget').post(forgetPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/update').put(isAuthenticatedUser, upload.single('avatar'), updateProfile);


// ADMIN ROUTES

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id')
                              .get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
                              .put(isAuthenticatedUser, authorizeRoles('admin'), upload.single('avatar'), updateUserRole)
                              .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);
                            
                            
module.exports = router;