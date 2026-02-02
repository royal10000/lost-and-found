// require("dotenv").config()

const AppError = require("../utils/AppError.utils");
const { verifyToken } = require("../utils/jwt.utils");

const authVerify =  (req, res, next) => {
  try {
    const access_token = req.cookies?.access_token;
    if (!access_token) {
      return next(
        new AppError("You're not logged in. please login first", 401),
      );
    }
    req.token = verifyToken(access_token);
    next();
  } catch (error) {
    return next(new AppError("Invalid token or Expired Token", 403));
  }
};

module.exports = authVerify;
