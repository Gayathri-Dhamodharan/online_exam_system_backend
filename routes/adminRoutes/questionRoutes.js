const router        = require("express").Router();
const ctrl          = require("../controllers/questionController");
const { verifyToken } = require("../middleware/userAuthToken");

router.use(verifyToken);
router.post   ("/",      ctrl.create);
router.get    ("/",      ctrl.list);
router.get    ("/:id",   ctrl.getById);
router.put    ("/:id",   ctrl.update);
router.delete ("/:id",   ctrl.delete);

module.exports = router;
