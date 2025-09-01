const multer = require("multer");
const cloudinary = require("cloudinary").v2;  // ✅ use v2
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uplodFileToCloudinary = async (file) => {
  console.log("Uploading buffer to Cloudinary...");
  try {
    const options = {
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    };

    return new Promise((resolve, reject) => {
      const uploader =
        file.mimetype.startsWith("video")
          ? cloudinary.uploader.upload_large
          : cloudinary.uploader.upload;

      const filePath = file.path.replace(/\\/g, "/"); // ✅ normalize path for Windows

      uploader(filePath, options, (error, result) => {
        fs.unlink(filePath, () => {}); // delete local file after upload
        if (error) {
          console.error("Cloudinary error:", error);
          return reject(error);
        }
        console.log("Cloudinary upload success:", result);
        resolve(result);
      });
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

const multerMiddleware = multer({ dest: "uploads/" }).single("media");

module.exports = { uplodFileToCloudinary, multerMiddleware };
