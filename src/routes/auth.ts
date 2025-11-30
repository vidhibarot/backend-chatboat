import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

import { models } from '../index'; // Use the exported models

const router = express.Router();

// =============================
// REGISTER ADMIN
// =============================
router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("fullName").optional().isString()
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName } = req.body;

    try {
      console.log("ave cheheheheh.......",email,password,fullName)
      const existingAdmin = await models.Admin.findOne({ where: { email } });

      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await models.Admin.create({
        email,
        password: hashedPassword,
        fullName
      });

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName
        }
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// =============================
// LOGIN ADMIN
// =============================
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const admin = await models.Admin.findOne({ where: { email } });

      if (!admin) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName
        }
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
