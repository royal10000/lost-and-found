const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateCsrfToken } = require("../middlewares/csrf.middleware");
const AppError = require("../utils/AppError.utils");
const { signToken } = require("../utils/jwt.utils");
exports.loginForm = async (req, res) => {
  res.status(200).json({ csrf: generateCsrfToken(req, res) });
};
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select("+password");

    if (!user) return next(new AppError("user not found", 404));
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      return next(new AppError("password doesn't matched", 404));
     signToken(res, {
      username: user.username,
      role: user.role,
      id: user._id,
    });
    res.status(200).json({
      success: true,
      data: user,
      message: "user logged in successfull",
    });
  } catch (error) {
    next(new AppError(error.message, 404));
  }
};
exports.signupForm = async (req, res) => {
  const token = generateCsrfToken(req, res);
  res.status(200).json({ csrf: token });
};
exports.singup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // console.log(req.body);
    if (!(username || email || password)) {
      return next(
        new AppError("username, email and password should be required", 404),
      );
    }

    const newPassword = await bcrypt.hash(password, 10);
    const userCount = await User.find().countDocuments();

    const user = new User({
      username,
      email,
      password: newPassword,
    });

    if (userCount < 1) {
      user.role = "admin";
    }
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "user created successfully", user });
  } catch (error) {
    next(new AppError(`${error.message}`, 404));
  }
};
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");

    // 2. If you are using sessions for CSRF, destroy the session too
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
    });
    res
      .status(200)
      .json({ success: true, message: "user logged out successfully" });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
