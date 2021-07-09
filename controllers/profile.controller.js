const User = require("../models/user.model");

const getProfilePage = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (user === null) {
      return res.status(500).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};

module.exports = {
  getProfilePage,
};
