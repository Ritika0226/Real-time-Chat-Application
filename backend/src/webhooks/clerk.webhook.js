import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("✅ Clerk webhook hit");

  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!signingSecret) {
      return res.status(503).json({ message: "Webhook secret missing" });
    }

    // Convert Express req into a Fetch API Request object
    // (verifyWebhook expects headers.get(), which only Fetch Request supports)
    const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const fetchRequest = new Request(url, {
      method: req.method,
      headers: new Headers(
        Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : v])
      ),
      body: req.body, // raw Buffer since index.js uses express.raw() for this route
    });

    const evt = await verifyWebhook(fetchRequest, {
      signingSecret,
    });

    console.log("📩 Event Type:", evt.type);

    // =========================
    // USER CREATED / UPDATED
    // =========================
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find(
          (e) => e.id === u.primary_email_address_id
        )?.email_address ||
        u.email_addresses?.[0]?.email_address;

      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.username ||
        email?.split("@")[0];

      console.log("💾 Saving user to MongoDB...");

      await User.findOneAndUpdate(
        { clerkId: u.id },
        {
          clerkId: u.id,
          email,
          fullName,
          profilePic: u.image_url,
        },
        {
          upsert: true,
          new: true,
        }
      );

      console.log("✅ User saved in MongoDB");
    }

    // =========================
    // USER DELETED
    // =========================
    if (evt.type === "user.deleted") {
      await User.findOneAndDelete({ clerkId: evt.data.id });
      console.log("🗑 User deleted from MongoDB");
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Clerk webhook error:", error.message);
    return res.status(400).json({ error: "Webhook verification failed" });
  }
});

export default router;