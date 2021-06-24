const { string } = require("joi");
const Post = require("../models/post.model");
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
    post = await post.populate("postedBy").execPopulate();

    post.postedBy.password = undefined;

    return res.json({ post });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

module.exports = {
  createPost,
};
