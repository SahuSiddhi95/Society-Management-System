const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      
      req.user = await User.findById(decoded.id).select("-password");
      console.log(req.user);
     console.log(decoded.id);
      // Important
      if (!req.user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } else {
    res.status(401).json({
      message: "No token",
    });
  }
};
