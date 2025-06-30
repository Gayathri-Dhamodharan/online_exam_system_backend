const router = require("express").Router();
const classCtrl      = require("../controllers/adminControllers/classController");
const {verifyToken} = require ("../middleware/userAuthToken");

router.use(verifyToken);


router.get('/',       classCtrl.getAllClasses);
router.get('/:id',    classCtrl.getClassById);
router.post('/' , classCtrl.createClass)

module.exports = router;