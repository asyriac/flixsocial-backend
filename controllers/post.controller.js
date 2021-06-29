const { string } = require("joi");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const { postValidationSchema } = require("../utils/validation");

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.decodedToken.id;

    const validationResult = postValidationSchema.validate(
      { content },
      { abortEarly: false }
    );

    if (validationResult.error !== undefined)
      return res.status(400).json({
        error: validationResult.error.details,
      });

    let post = await Post.create({ content, postedBy: user });
    post = await post.populate("postedBy", "-password -likes").execPopulate();

    return res.json({ post });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const fetchPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("postedBy", "-password -likes")
      .populate({ path: "retweetData", populate: { path: "postedBy" } })
      .sort({ createdAt: -1 });

    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const likePost = async (req, res) => {
  const postId = req.params.postId;
  const user = req.decodedToken.id;

  const post = await Post.findOne({ _id: postId });

  const isLiked = post.likes.includes(user);
  const option = isLiked ? "$pull" : "$addToSet";

  await Post.findByIdAndUpdate(postId, { [option]: { likes: user } });
  await User.findByIdAndUpdate(user, { [option]: { likes: postId } });

  return res.json({ message: "Tweet liked." });
};

const retweetPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = req.decodedToken.id;

    let retweetPost = await Post.findOneAndDelete({
      postedBy: user.id,
      retweetData: postId,
    });

    if (retweetPost)
      return res.status(200).json({ message: "Reweet removed." });

    const option = retweetPost !== null ? "$pull" : "$addToSet";

    if (retweetPost === null) {
      retweetPost = await Post.create({ postedBy: user, retweetData: postId });
    }

    await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: user } });
    await User.findByIdAndUpdate(user, {
      [option]: { retweets: retweetPost._id },
    });
    return res.status(200).json({ message: "Post retweeted." });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

module.exports = {
  createPost,
  fetchPosts,
  likePost,
  retweetPost,
};
