const express = require("express");
const {
  registerUser,
  loginUser,
  protectedRoute,
  logoutUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.get("/hello", protectedRoute, (req, res) => {
  return res.json({ message: "Howdy" });
});

module.exports = router;
