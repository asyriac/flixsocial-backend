const express = require("express");
const { registerUser, loginUser, protectedRoute, logoutUser, currentUser } = require("../controllers/user.controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/current-user", protectedRoute, currentUser);

// post routes
const postRoutes = require("./post.route");
router.use("/posts", protectedRoute, postRoutes);

// profile routes
const profileRoutes = require("./profile.route");
router.use("/profile", protectedRoute, profileRoutes);

const userRoutes = require("./user.route");
router.use("/users", protectedRoute, userRoutes);

const searchRoutes = require("./search.route");
router.use("/search", protectedRoute, searchRoutes);

router.get("/hello", protectedRoute, (req, res) => {
  console.log(req.decodedToken.id);
  return res.json({ message: "Howdy" });
});

module.exports = router;
