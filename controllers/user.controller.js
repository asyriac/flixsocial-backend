const User = require("../models/user.model");
const { genSalt, hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");

const maxAge = 60 * 60 * 24 * 3;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const setTokenToCookie = (id, res) => {
  const token = createToken(id);
  res.cookie("accessToken", token, {
    httpOnly: true,
    maxAge: maxAge * 1000,
  });
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const result = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    result.password = undefined;
    setTokenToCookie(result.id, res);
    return res.json({
      result,
    });
  } catch (err) {
    return res.json({
      err,
    });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isAuthenticated = await compare(user.password, password);
};

module.exports = {
  registerUser,
};
