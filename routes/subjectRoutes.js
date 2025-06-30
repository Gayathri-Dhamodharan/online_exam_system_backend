const router = require("express").Router();
const subjectCtrl = require("../controllers/adminControllers/subjectController");
const {verifyToken} = require ("../middleware/userAuthToken");

router.use(verifyToken);

// GET   /subjects       → list all
// GET   /subjects/:id   → get one
router.get('/',       subjectCtrl.getAllSubjects);
router.get('/:id',    subjectCtrl.getSubjectById);
router.post('/', subjectCtrl.createSubject)

module.exports = router;
