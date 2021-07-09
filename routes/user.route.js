const express = require("express");
const { followUser } = require("../controllers/user.controller");
const router = express.Router();

router.route("/:userID/follow").put(followUser);

module.exports = router;
