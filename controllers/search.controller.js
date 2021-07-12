const Post = require("../models/post.model");
const User = require("../models/user.model");

const searchPost = async (req, res) => {
  try {
    const searchObj = req.query;

    if (searchObj.search.length === 0) {
      return res.status(200).json({ posts: [] });
    }
    if (searchObj.search !== undefined) {
      searchObj.content = { $regex: searchObj.search, $options: "i" };
      delete searchObj.search;
    }

    const posts = await Post.find(searchObj)
      .populate("postedBy", "-password -likes")
      .populate({ path: "replyTo", populate: { path: "postedBy" } })
      .populate({ path: "retweetData", populate: { path: "postedBy" } })
      .sort({ createdAt: -1 });

    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const searchUsers = async (req, res) => {
  try {
    let searchObj = req.query;

    if (searchObj.search.length === 0) {
      return res.status(200).json({ posts: [] });
    }
    if (searchObj.search !== undefined) {
      searchObj = {
        $or: [
          { firstName: { $regex: searchObj.search, $options: "i" } },
          { lastName: { $regex: searchObj.search, $options: "i" } },
          { username: { $regex: searchObj.search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(searchObj);

    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

module.exports = { searchPost, searchUsers };
