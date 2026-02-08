const { generateCsrfToken } = require("../middlewares/csrf.middleware");
const Item = require("../models/items.model");
const AppError = require("../utils/AppError.utils");
exports.getMyItem = async (req, res, next) => {
  try {
    const items = await Item.find({ uploader: req.user.id });
    res.status(200).json({
      success: true,
      message: "item fetched successfully",
      data: items,
    });
  } catch (error) {
    next(new AppError(error, 500));
  }
};
exports.resetPasswordForm=async(req,res,next)=>{
    res.status(200).json({csrf:generateCsrfToken(req,res)})
}

exports.resetPassword=async(req,res,next)=>{
    
}