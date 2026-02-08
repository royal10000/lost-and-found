const Item = require("../models/items.model");
const AppError = require("../utils/AppError.utils");
const isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return next(new AppError("item is not available", 400));
    }

    if (!item.uploader.equals(req.user.id)) {
      return next(new AppError("unauthorized access", 401));
    }
    req.item = item;
    next();
  } catch (error) {
    next(new AppError(`error ${error.message}`, 402));
  }
};

module.exports = isOwner;
