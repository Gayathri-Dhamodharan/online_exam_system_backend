// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken }     = require("../../middleware/userAuthToken");
const { getReviewData }   = require("../../controllers/adminControllers/reviewController");

// require authentication
router.use(verifyToken);

// GET /api/review?class=4&exam=Mid-Term
router.get("/review", getReviewData);

module.exports = router;
