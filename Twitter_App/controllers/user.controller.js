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
  res.render("signup", { title: "Signup",error_msg: "" });
};

const loginPage = (req, res) => {
  res.render("login", { title: "Login",error_msg: "" });
};

const createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validate user input using Joi
    const { error } = validateUser(req.body);
    if (error) {
      req.flash("error_msg", error.message);
      return res.redirect("/api/v1/users/signup");
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error_msg", "User already registered");
      return res.redirect("/api/v1/users/signup");
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Set session and success flash message
    req.session.userId = user._id;
    req.flash("success_msg", "Signup successful. You are now logged in.");
    res.redirect("/api/v1");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Something went wrong. Please try again.");
    res.redirect("/api/v1/users/signup");
  }
};


const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.render("login", {
      title: "Login",
      error_msg: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("login", {
      title: "Login",
      error_msg: "Invalid credentials",
    });
  }

  // If login successful
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
