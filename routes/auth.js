const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { verifyToken } = require("../middleware/userAuthToken");
const { singleUpload } = require("../middleware/multer");

router.post("/register", controller.userRegister);
router.post("/login", controller.userLogin);
router.put(
  "/update-profile/:userId",
  verifyToken,
  singleUpload,
  controller.updateUserProfile
);
router.get("/getSingle-User/:userId", verifyToken, controller.getSingleUser);
router.get("/getAll-Users", verifyToken, controller.getAllUser);
router.put("/delete-user/:userId", verifyToken, controller.DeleteUser);

module.exports = router;
