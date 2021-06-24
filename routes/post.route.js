const express = require("express");
const { createPost } = require("../controllers/post.controller");
const { protectedRoute } = require("../controllers/user.controller");
const router = express.Router();

router.route("/").post(protectedRoute, createPost);

module.exports = router;
