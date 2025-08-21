import Course from "../models/Course.js";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";

// ✅ Get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get user's enrolled courses
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const userData = await User.findById(userId).populate({
      path: "enrolledCourses",
      populate: { path: "lectures" },
    });

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    let { origin } = req.headers;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }

    const amount = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // ✅ fallback if origin is missing (Postman or server-to-server requests)
    if (!origin) {
      origin = process.env.CLIENT_URL || "http://localhost:3000";
    }

    const line_items = [
      {
        price_data: {
          currency,
          product_data: { name: courseData.courseTitle },
          unit_amount: Math.floor(amount * 100), // cents
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items,
      mode: "payment",
      metadata: { purchaseId: newPurchase._id.toString() },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
