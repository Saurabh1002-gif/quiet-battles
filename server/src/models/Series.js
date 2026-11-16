import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, required: true },
  coverImage: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Series", seriesSchema);
