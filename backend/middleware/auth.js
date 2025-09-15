const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to req.user
    req.user = {
      id: verified.id,       // MongoDB _id of user/vendor/admin
      role: verified.role,   // user | vendor | admin
      vendorId: verified.vendorId || null,  // 👈 include vendorId
    };

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
