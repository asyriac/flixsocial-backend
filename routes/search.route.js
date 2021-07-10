const express = require("express");
const { searchPost, searchUsers } = require("../controllers/search.controller");
const router = express.Router();

router.route("/posts").get(searchPost);
router.route("/users").get(searchUsers);

module.exports = router;
