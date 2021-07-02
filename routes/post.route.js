const express = require("express");
const { createPost, fetchPosts, likePost, retweetPost, replyToPost, fetchPost } = require("../controllers/post.controller");
const router = express.Router();

router.route("/").get(fetchPosts).post(createPost);
router.route("/:postId").get(fetchPost);
router.route("/:postId/like").post(likePost);
router.route("/:postId/retweet").post(retweetPost);
router.route("/:postId/reply").post(replyToPost);

module.exports = router;
