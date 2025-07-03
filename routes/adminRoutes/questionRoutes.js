const router = require("express").Router();
const questionCtrl = require("../../controllers/adminControllers/questionController");
const { verifyToken } = require("../../middleware/userAuthToken");

// POST   /questions          → createQuestion
// GET    /questions/:id      → getQuestionById
// DELETE /questions/:id      → deleteQuestionById
// PATCH  /questions/:id/answer → updateAnswerById

router.use(verifyToken);
router.post("/create-questions", questionCtrl.createQuestion);
router.get("/getAllQuestionsForCls/:classId/:subjId", questionCtrl.getAllQuestions);
router.get("/:id", questionCtrl.getQuestion);
router.delete("/delete-question/:id", questionCtrl.deleteQuestion);
router.put("/update-question/:id", questionCtrl.updateQuestion);

module.exports = router;
