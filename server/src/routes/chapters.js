import { Router } from "express";
import Chapter from "../models/Chapter.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.seriesSlug) {
      const Series = (await import("../models/Series.js")).default;
      const series = await Series.findOne({ slug: req.query.seriesSlug });
      if (!series) return res.json([]);
      filter.series = series._id;
    }
    res.json(await Chapter.find(filter).populate("series", "title slug").populate("product", "name slug image price").sort({ number: 1 }));
  } catch (err) { next(err); }
});
router.get("/:slug", async (req, res, next) => {
  try {
    const item = await Chapter.findOne({ slug: req.params.slug }).populate("series", "title slug").populate("product", "name slug image price");
    if (!item) return res.status(404).json({ message: "Chapter not found." });
    res.json(item);
  } catch (err) { next(err); }
});
router.post("/", requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Chapter.create(req.body)); } catch (err) { next(err); }
});
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Chapter not found." });
    res.json(item);
  } catch (err) { next(err); }
});
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Chapter.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Chapter not found." });
    res.json({ message: "Chapter removed." });
  } catch (err) { next(err); }
});

export default router;
