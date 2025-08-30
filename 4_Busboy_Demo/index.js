
import express from "express";
import Busboy from "busboy";
import mongoose from "mongoose";
import File from "./models/file.js";
import fs from "fs";
import path from "path";

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/busboy_demo", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Upload route (optimized)
app.post("/upload", async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  let fileSaved = false;


  busboy.on("file", (fieldname, file, info) => {
    const { filename, mimeType } = info;
    const chunks = [];
    file.on("data", (data) => chunks.push(data));
    file.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      try {
        // Generate unique filename
        const ext = path.extname(filename);
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}${ext}`;
        const uploadPath = path.join("./uploads", uniqueName);
        fs.writeFileSync(uploadPath, buffer);

        // Save file to MongoDB with unique name
        const newFile = new File({ filename: uniqueName, contentType: mimeType, data: buffer });
        const saved = await newFile.save();
        if (!fileSaved) {
          fileSaved = true;
          res.json({ _id: saved._id, filename: saved.filename, savedTo: uploadPath });
        }
      } catch (err) {
        if (!fileSaved) {
          fileSaved = true;
          res.status(500).json({ error: "Error saving file" });
        }
      }
    });
  });

  busboy.on("error", (err) => {
    if (!fileSaved) {
      fileSaved = true;
      res.status(500).json({ error: "Busboy error" });
    }
  });

  req.pipe(busboy);
});

// Download route
app.get("/file/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send("File not found");
    res.set("Content-Type", file.contentType);
    res.send(file.data);
  } catch (err) {
    res.status(500).send("Error fetching file");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));




