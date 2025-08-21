import { clerkClient } from "@clerk/express";

// Protect Educator Routes
export const protectEducator = async (req, res, next) => {
  try {
    let userId;

    if (process.env.NODE_ENV === "development") {
      // ✅ Mock user for Postman testing
      userId = "test-user-id";
      req.auth = { userId };
    } else {
      // ✅ Real Clerk
      userId = req.auth?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authorized" });
      }

      const response = await clerkClient.users.getUser(userId);
      if (response.publicMetadata.role !== "educator") {
        return res.status(403).json({ success: false, message: "Unauthorized Access" });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
