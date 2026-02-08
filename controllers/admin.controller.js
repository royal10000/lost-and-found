const AppError = require("../utils/AppError.utils");
const Item = require("../models/items.model");
exports.verifyPost = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const id = req.params?.id;
    const user = req.user;
    if (!["true", "false"].includes(isApproved)) {
      return next(
        new AppError("isApproved should be in 'true' or 'false' ", 400),
      );
    }
    const item = await Item.findById(id);
    if (!item) {
      return next(new AppError("Item not found", 404));
    }
    item.isApproved = isApproved === "true";
    item.isVerified = true;
    item.verifiedAt = new Date();
    item.verifiedBy = user.id;
    await item.save();
    res.status(200).json({
      success: true,
      message: "item verified successfully",
      data: item,
    });
  } catch (error) {
    next(new AppError(error, 500));
  }
};

exports.itemStatus = async (req, res, next) => {
  try {
    const id = req.params?.id;
    const { status } = req.body;
    if (!["open", "claimed", "closed"].includes(status)) {
      return next(new AppError("status should be among open, claimed, closed"));
    }
    const item = await Item.findById(id);
    if (!item) {
      return next(new AppError("Item not found", 404));
    }
    item.status = status;
    await item.save();
    res
      .status(200)
      .json({
        success: true,
        message: "status change success fully",
        data: item,
      });
  } catch (error) {
    next(new AppError(error, 500));
  }
};
