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

// post routes
const postRoutes = require("./post.route");
router.use("/posts", postRoutes);

router.get("/hello", protectedRoute, (req, res) => {
  console.log(req.decodedToken.id);
  return res.json({ message: "Howdy" });
});

module.exports = router;
