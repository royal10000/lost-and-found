const multer = require("multer");
const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {
  // Multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }

  // Zod validation errors
  // if (err instanceof ZodError) {
  //   return res.status(400).json({
  //     success: false,
  //     errors: err.errors.map(e => e.message),
  //   });
  // }

  // Generic / custom errors
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    errors: [err.message || "Internal server error"],
  });
};

module.exports = errorHandler;
