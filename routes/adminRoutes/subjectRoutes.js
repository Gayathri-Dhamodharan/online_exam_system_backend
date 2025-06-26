const router = require("express").Router();
const subCtrl = require("../../controllers/adminControllers/subjectController");
const {verifyToken} = require ("../../middleware/userAuthToken");

router.use(verifyToken);
router.post   ("/",      subCtrl.create);
router.get("/",          subCtrl.getAll);
router.get("/:id",        subCtrl.getById);
router.put("/:id",          subCtrl.update);
router.delete("/:id",      subCtrl.delete);

module.exports = router;
