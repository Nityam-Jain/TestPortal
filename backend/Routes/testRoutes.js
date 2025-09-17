const express = require("express");

const router = express.Router();

const { createTest, getAllTests, getTestById, updateTest, deleteTest, getPublicTests } = require("../controller/testController");

const requireAuth = require("../middleware/auth");

router.post("/", requireAuth, createTest);

router.get("/getAllTests", requireAuth, getAllTests);

router.get("/public", getPublicTests);

router.get("/:id", getTestById);

router.put("/:id", requireAuth, updateTest);

router.delete("/deleteTest/:id", requireAuth, deleteTest);

module.exports = router;