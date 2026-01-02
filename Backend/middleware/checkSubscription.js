const checkSubscription = (req, res, next) => {
  try {
    // Only organisers need subscription check
    if (req.user.role === "organizer") {
      if (
        !req.user.subscription ||
        req.user.subscription.status !== "active"
      ) {
        return res.status(403).json({
          message: "Active subscription required ❌",
        });
      }
    }
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Subscription check failed",
    });
  }
};

export default checkSubscription;
