import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password || email !== adminEmail || !adminPassword) {
    return res.status(401).json({ message: "Email or password is incorrect." });
  }

  // The configured password is hashed before comparison so the same
  // comparison method can be used if admin accounts move into MongoDB.
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const validPassword = await bcrypt.compare(password, passwordHash);
  if (!validPassword) return res.status(401).json({ message: "Email or password is incorrect." });

  const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, admin: { email } });
});

export default router;
