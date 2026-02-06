const multer = require("multer");
// const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {
  // console.log("🔥 ERROR HANDLER HIT");
  // console.log("res type:", typeof res);
  // console.log("res keys:", Object.keys(res || {}));
  // console.log("is Express res?", typeof res?.status);
  console.error("🔥 ERROR:", {
    message: err.message,
    stack: err.stack,
    status: err.statusCode,
    path: req.originalUrl,
    method: req.method,
  });
  // Multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }

  // Generic / custom errors
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    errors: [err.message || "Internal server error"],
  });
};

module.exports = errorHandler;
