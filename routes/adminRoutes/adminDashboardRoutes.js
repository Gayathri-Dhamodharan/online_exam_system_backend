// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../../controllers/adminControllers/getAdminDashboard');
const { verifyToken } = require("../../middleware/userAuthToken");

router.use(verifyToken);
router.get(
  '/dashboard',        // only admins allowed
  getAdminDashboard
);

module.exports = router;
