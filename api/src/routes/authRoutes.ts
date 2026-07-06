import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "../config/passport"; // ensure passport config is executed

export const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

interface GoogleUser {
  id: string;
  displayName: string;
  email: string;
}

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL!}/login`,
    session: false,
  }),
  (req, res) => {
    try {
      const user = req.user as GoogleUser;

      const token = jwt.sign(
        { id: user.id, name: user.displayName, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" },
      );

      // The client port default for Vite is 5173. Allow overriding via config
      const clientUrl = process.env.CLIENT_URL!;
      res.redirect(`${clientUrl}?token=${token}`);
    } catch (error) {
      res.status(500).json({ success: false, error: "Authentication failed" });
    }
  },
);
