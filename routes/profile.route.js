const express = require("express");
const { getProfilePage } = require("../controllers/profile.controller");
const router = express.Router();

router.route("/:username").get(getProfilePage);

module.exports = router;
