import Organizer from "../models/Organizer.js";

const checkSubscription = async (req, res, next) => {
  try {
    // Only organizers need subscription
    if (req.user.role !== "organizer") {
      return next();
    }

    const organizer = await Organizer.findById(req.user.id);

    if (!organizer || !organizer.subscription) {
      return res.status(403).json({
        message: "No subscription found ❌",
      });
    }

    const sub = organizer.subscription;

    // Status check
    if (sub.status !== "active") {
      return res.status(403).json({
        message: "Active subscription required ❌",
      });
    }

    // Expiry check
    if (sub.endDate && new Date(sub.endDate) < new Date()) {
      return res.status(403).json({
        message: "Subscription expired ❌",
      });
    }

    // Event limit check
    if (sub.eventsUsed >= sub.eventsAllowed) {
      return res.status(403).json({
        message: "Event limit reached ❌",
      });
    }

    // Attach organizer to request (important)
    req.organizer = organizer;

    next();
  } catch (err) {
    console.error("Subscription check error:", err);
    return res.status(500).json({
      message: "Subscription validation failed",
    });
  }
};

export default checkSubscription;
