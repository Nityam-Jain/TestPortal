const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
 
 
const auth = require("../middleware/auth");
 
router.post("/", auth, categoryController.createCategory);
router.get("/:subjectId", auth, categoryController.getCategoriesBySubject);
router.put("/:id", auth, categoryController.updateCategory);
router.delete("/:id", auth, categoryController.deleteCategory);

router.get("/public/:subjectId", categoryController.getPublicCategoriesBySubject);


module.exports = router;
