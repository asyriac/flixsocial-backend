const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pinned: { type: Boolean },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
