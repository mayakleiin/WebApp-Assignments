const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

router.post("/", commentsController.createComment); // Create a new comment

module.exports = router;