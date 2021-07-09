const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: {
    type: String,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

userSchema.pre("save", function (next) {
  this.profilePic = `https://ui-avatars.com/api/?name=${this.firstName}+${this.lastName}&background=0D8ABC&color=fff`;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
