const router = require("express").Router();
const classCtrl      = require("../controllers/adminControllers/classController");
const {verifyToken} = require ("../middleware/userAuthToken");

router.use(verifyToken);

// GET   /classes       → list all, so front-end can populate a dropdown
// GET   /classes/:id   → get one (if needed)
router.get('/',       classCtrl.getAllClasses);
router.get('/:id',    classCtrl.getClassById);
router.post('/' , classCtrl.createClass)

module.exports = router;