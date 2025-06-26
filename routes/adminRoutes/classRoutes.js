

const router  = require("express").Router();
const clsCtrl = require("../../controllers/adminControllers/classController");
const { verifyToken } = require("../../middleware/userAuthToken")

router.use(verifyToken);
router.post("/",      clsCtrl.create);
router.get("/",       clsCtrl.getAll);
router.get("/:id",    clsCtrl.getById);
router.put("/:id",     clsCtrl.update);
router.delete ("/:id",   clsCtrl.delete);

module.exports = router;
