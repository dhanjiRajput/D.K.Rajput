import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,   // binary data
});

export default mongoose.model("File", fileSchema);