const AppError = require("../utils/AppError.utils");

const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("UnAuthorized access", 402));
  }
  next();
};

module.exports = isAdmin;
