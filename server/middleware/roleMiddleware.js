// middleware/roleMiddleware.js
exports.adminOnly = (req, res, next) => {
    // Check user exists
  if (!req.user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  // Check admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
  next();
};
