import cloudinary from "../lib/cloudinary";
import { generateToken } from "../lib/utils";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

// -------------------- Signup --------------------
export const signup = async (req: any, res: any) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "Account already exist, try Another one",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashed,
      bio,
    });

    const token = generateToken(newUser._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created Successfully.....",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    } else {
      console.log(error);
      res.json({ success: false, message: "An error occurred" });
    }
  }
};

// -------------------- Login --------------------
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "Invalid Credentials.." });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordMatched) {
      return res.json({ success: false, message: "Invalid Credentials.." });
    }

    const token = generateToken(userData._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      userData,
      token,
      message: "Login Successfully.....",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    } else {
      console.log(error);
      res.json({ success: false, message: "An error occurred" });
    }
  }
};

// -------------------- Check Auth --------------------
export const checkAuth = (req: any, res: any) => {
  console.log("Cookie in checkAuth:", req.cookies);
  console.log("Cookie in user:", req.user);

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// -------------------- Update Profile --------------------
export const updateProfile = async (req: any, res: any) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    } else {
      console.log(error);
      res.json({ success: false, message: "An error occurred" });
    }
  }
};

// -------------------- Logout --------------------
export const logout = (req: any, res: any) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // must match cookie setting
    sameSite: "lax",
  });
  return res.json({ success: true, message: "Logged out successfully" });
};