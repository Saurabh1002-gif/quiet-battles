import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  number: { type: Number, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: "" },
  series: { type: mongoose.Schema.Types.ObjectId, ref: "Series", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null }
}, { timestamps: true });

export default mongoose.model("Chapter", chapterSchema);
