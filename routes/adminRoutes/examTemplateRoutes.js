const router        = require("express").Router();
const ctrl          = require("../../controllers/adminControllers/examTemplateController");
const { verifyToken } = require("../../middleware/userAuthToken");

router.use(verifyToken);
// Template CRUD
router.post   ("/",        ctrl.createTemplate);
router.get    ("/",        ctrl.getTemplates);
// router.get    ("/:id",     ctrl.getTemplateById);
// router.put    ("/:id",     ctrl.updateTemplate);
// router.delete ("/:id",     ctrl.deleteTemplate);

// Question management
// router.post   ("/:id/questions",      ctrl.addQuestion);
// router.delete ("/:id/questions/:qId", ctrl.removeQuestion);

module.exports = router;
