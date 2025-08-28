// This code wont save file in to the folder directly save to MongoDB

// import express from "express";
// import Busboy from "busboy";
// import mongoose from "mongoose";
// import File from "./models/file.js";

// const app = express();

// // connect to MongoDB
// await mongoose.connect("mongodb://127.0.0.1:27017/busboy_demo");

// // upload route
// app.post("/upload", (req, res) => {
//   const busboy = Busboy({ headers: req.headers });

//   busboy.on("file", (fieldname, file, info) => {
//     const { filename, encoding, mimeType } = info; // ✅ correct destructuring
//     console.log(`Uploading: ${filename}`);

//     // collect file chunks in memory
//     const chunks = [];
//     file.on("data", (data) => {
//       chunks.push(data);
//     });

//     file.on("end", async () => {
//       const buffer = Buffer.concat(chunks);

//       try {
//         // save into MongoDB
//         const newFile = new File({
//           filename,
//           contentType: mimeType,
//           data: buffer,
//         });

//         const saved = await newFile.save();
//         console.log("File saved to MongoDB:", saved._id);

//         // respond with JSON including _id
//         res.json(saved);
//       } catch (err) {
//         console.error("Error saving file:", err);
//         res.status(500).send("Error saving file");
//       }
//     });
//   });

//   req.pipe(busboy);
// });

// // download route (to get file back)
// app.get("/file/:id", async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id);
//     if (!file) return res.status(404).send("File not found");

//     res.set("Content-Type", file.contentType);
//     res.send(file.data);
//   } catch (err) {
//     res.status(500).send("Error fetching file");
//   }
// });

// app.listen(3000, () => console.log("Server running on http://localhost:3000"));

