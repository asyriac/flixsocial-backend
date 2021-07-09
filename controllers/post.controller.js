const { string } = require("joi");
const { find } = require("../models/post.model");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const { postValidationSchema } = require("../utils/validation");

const createPost = async (req, res) => {
  try {
    console.log(req.body);
    const { content } = req.body;
    const user = req.decodedToken.id;

    const validationResult = postValidationSchema.validate({ content }, { abortEarly: false });

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
    const filter = req.query;
    console.log(filter);
    const user = req.decodedToken.id;
    if (filter.followingOnly !== undefined) {
      const followingOnly = filter.followingOnly === "true";
      if (followingOnly) {
        const userData = await User.findById(user);
        const following = userData.following;
        following.push(user);
        filter.postedBy = { $in: following };
      }
      delete filter.followingOnly;
    }

    console.log(filter);
    const posts = await Post.find(filter)
      .populate("postedBy", "-password -likes")
      .populate({ path: "replyTo", populate: { path: "postedBy" } })
      .populate({ path: "retweetData", populate: { path: "postedBy" } })
      .sort({ createdAt: -1 });

    return res.status(200).json({ posts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

const fetchPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("postedBy", "-password -likes")
      .populate({ path: "replyTo", populate: { path: "postedBy" } })
      .populate({ path: "retweetData", populate: { path: "postedBy" } });

    let replyTo;
    if (post.replyTo !== undefined) {
      replyTo = post.replyTo;
    }

    const replies = await Post.find({ replyTo: postId }).populate("postedBy", "-password -likes");

    return res.status(200).json({ post, replyTo, replies });
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

  return res.json({ message: isLiked ? "Tweet unliked." : "Tweet liked." });
};

const retweetPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = req.decodedToken.id;

    let retweetPost = await Post.findOneAndDelete({
      postedBy: user,
      retweetData: postId,
    });

    const option = retweetPost !== null ? "$pull" : "$addToSet";

    if (retweetPost === null) {
      retweetPost = await Post.create({ postedBy: user, retweetData: postId });
    }

    await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: user } });
    await User.findByIdAndUpdate(user, {
      [option]: { retweets: retweetPost._id },
    });
    return res.status(200).json({ message: retweetPost ? "Post retweeted." : "Post removed." });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const replyToPost = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.decodedToken.id;
    const postId = req.params.postId;

    const validationResult = postValidationSchema.validate({ content }, { abortEarly: false });

    if (validationResult.error !== undefined)
      return res.status(400).json({
        error: validationResult.error.details,
      });

    let post = await Post.create({ content, postedBy: user, replyTo: postId });
    post = await post.populate("postedBy", "-password -likes").execPopulate();

    return res.json({ post });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

module.exports = {
  createPost,
  fetchPosts,
  fetchPost,
  likePost,
  retweetPost,
  replyToPost,
};
