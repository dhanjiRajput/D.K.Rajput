const User = require("../models/user.model");

exports.getPage = async (req, res) => {
  try {
    const data = await User.find(); // assuming Mongoose
    res.render('index', { data }); // this must be an array
  } catch (err) {
    console.error(err);
    res.render('index', { data: [] }); // fallback to empty array
  }
};

exports.createBlog = async (req, res) => {
    const {title}=req.body;
    const blog=await User.create({
        title,
        profilePicture: `/uploads/${req.file.filename}`,
    });
    res.redirect("http://localhost:3000/upload");
};