import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export async function protectRoute(req, res, next) {
  try {
    const auth = getAuth(req);

    if (!auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: auth.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    req.auth = auth;
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(500).json({ message: "Authentication error" });
  }
}