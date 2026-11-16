import { Router } from "express";
import Product from "../models/Product.js";
import Chapter from "../models/Chapter.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try { res.json(await Product.find().sort({ createdAt: -1 })); } catch (err) { next(err); }
});
router.get("/:slug", async (req, res, next) => {
  try {
    const item = await Product.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ message: "Product not found." });
    res.json(item);
  } catch (err) { next(err); }
});
router.post("/", requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (err) { next(err); }
});
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Product not found." });
    res.json(item);
  } catch (err) { next(err); }
});
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found." });
    await Chapter.updateMany({ product: item._id }, { $set: { product: null } });
    res.json({ message: "Product removed." });
  } catch (err) { next(err); }
});

export default router;
