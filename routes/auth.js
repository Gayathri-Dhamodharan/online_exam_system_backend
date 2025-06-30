// routes/auth.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const { verifyToken }  = require('../middleware/userAuthToken');
const { singleUpload } = require('../middleware/multer');

// Public registration (role from body, defaults to student)
router.post('/register', ctrl.userRegister);

// Admin registration (force role=admin)
router.post(
  '/admin/register',
  (req, res, next) => {
    req.body.role = 'admin';
    next();
  },
  ctrl.userRegister
);

// Login
router.post('/login', ctrl.userLogin);

// Protected user routes
router.put('/update-profile/:userId', verifyToken, singleUpload, ctrl.updateUserProfile);
router.get('/getSingle-User/:userId', verifyToken, ctrl.getSingleUser);
router.get('/getAll-Users', verifyToken, ctrl.getAllUser);
router.put('/delete-user/:userId', verifyToken, ctrl.DeleteUser);

module.exports = router;
