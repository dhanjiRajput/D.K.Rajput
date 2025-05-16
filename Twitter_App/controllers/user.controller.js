const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Tweet = require("../models/twitter.model");
require("dotenv").config();

const complexityOptions = {
  min: 6,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const signupPage = (req, res) => {
  res.render("signup", { title: "Signup" });
};

const loginPage = (req, res) => {
  res.render("login", { title: "Login" });
};

const createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validating user Input using Joi
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send({ error: error.message });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ error: "User already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    req.session.userId = user._id;
    res.redirect("/api/v1");
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.redirect("/api/v1/users/login");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ error: "Invalid credentials" });

    req.session.userId = user._id;
    res.redirect("/api/v1");
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
};

const getUser = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect("/api/v1/users/login");

    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect("/api/v1/users/login");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
};

const getUserByUserName = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.redirect("/api/v1/users/login");

    const tweets = await Tweet.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username")
      .populate("comments.user", "username");

    res.json({ user, tweets });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie("token");
    res.redirect("/api/v1/users/login");
  });
};

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: PasswordComplexity(complexityOptions).required(),
  });
  return schema.validate(user);
};

module.exports = {
  createUser,
  userLogin,
  getUser,
  getUserByUserName,
  signupPage,
  loginPage,
  logoutUser,
};
