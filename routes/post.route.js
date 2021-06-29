const express = require("express");
const {
  createPost,
  fetchPosts,
  likePost,
  retweetPost,
} = require("../controllers/post.controller");
const router = express.Router();

router.route("/").get(fetchPosts).post(createPost);
router.route("/:postId/like").post(likePost);
router.route("/:postId/retweet").post(retweetPost);

module.exports = router;
