import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: "" },
  sizes: { type: [String], default: ["S", "M", "L", "XL"] }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
