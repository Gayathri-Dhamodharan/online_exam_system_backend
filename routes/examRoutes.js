// routes/examRoutes.js
const router = require("express").Router();
const examCtrl = require("../controllers/examController");
const { verifyToken } = require("../middleware/userAuthToken");

// All exam routes require the user to be authenticated
router.use(verifyToken);
router.post("/create-exam", examCtrl.createExam);

router.post("/getall-exam/:classId/:subjId", examCtrl.getExam); // Admin sees full exam; student sees it (sans answers) only if class matches
router.get("/get-exam/:id", examCtrl.getExam);
router.put("/update-exam/:id", examCtrl.updateExam); // Admin only
router.delete("/delete-exam/:id", examCtrl.deleteExam); // Admin only
router.get("/class/:className", examCtrl.getExamsByClassName
);
/**
 * Question management (admin only)
 */
router.post("/:id/questions-exam", examCtrl.addQuestion);
router.delete("/:id/questions-exam/:questionId", examCtrl.deleteQuestion);

module.exports = router;
