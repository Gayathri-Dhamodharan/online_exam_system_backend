const router = require("express").Router();
const quesCtrl = require("../../controllers/adminControllers/questionController");
const { verifyToken } = require("../../middleware/userAuthToken")

router.use(verifyToken);
router.post("/", quesCtrl.create);
router.get("/", quesCtrl.list);
router.get("/:id", quesCtrl.getById);
router.put("/:id", quesCtrl.update);
router.delete("/:id", quesCtrl.delete);

module.exports = router;
