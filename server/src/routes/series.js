import { Router } from "express";
import Series from "../models/Series.js";
import Chapter from "../models/Chapter.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try { res.json(await Series.find().sort({ createdAt: -1 })); } catch (err) { next(err); }
});
router.get("/:slug", async (req, res, next) => {
  try {
    const item = await Series.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ message: "Series not found." });
    res.json(item);
  } catch (err) { next(err); }
});
router.post("/", requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Series.create(req.body)); } catch (err) { next(err); }
});
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Series.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Series not found." });
    res.json(item);
  } catch (err) { next(err); }
});
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Series.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Series not found." });
    await Chapter.deleteMany({ series: item._id });
    res.json({ message: "Series and its chapters have been removed." });
  } catch (err) { next(err); }
});

export default router;
