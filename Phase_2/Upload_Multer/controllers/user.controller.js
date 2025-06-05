const User = require("../models/user.model");

exports.getPage = (req, res) => {
    res.render("index");
};

exports.createBlog = async (req, res) => {
    const {title}=req.body;
    const blog=await User.create({
        title,
        profilePicture: `/uploads/${req.file.filename}`,
    })
    res.send("Successfully created blog");
};