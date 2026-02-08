const { generateCsrfToken } = require("../middlewares/csrf.middleware");
const Item = require("../models/items.model");
const AppError = require("../utils/AppError.utils");
const {
  updateImage,
  unlinkImage,
  deleteImage,
} = require("../utils/image.utils");

exports.allitems = async (req, res, next) => {
  try {
    const { category } = req.params;
    const query = { isVerified: false };
    if (category) {
      query.category = category;
    }
    const items = await Item.find(query).populate("uploader");
    if (!items || items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "items are not available",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "items fetched successfully",
      data: items,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
exports.singleItem = async (req, res, next) => {
  try {
    const { slug, id } = req.params;

    const item = await Item.findOne({ _id: id, isVerified: false });
    if (!item) {
      return next(new AppError("item is not available", 400));
    }
    if (item.slug !== slug) {
      return res.redirect(`${item.slug}/${item._id}`);
    }

    res.status(200).json({
      success: true,
      message: "items fetched successfully",
      data: item,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
// exports.itemByCategories = async (req, res, next) => {};
exports.createItemForm = async (req, res) => {
  res.status(200).json({ csrf: generateCsrfToken(req, res) });
};
exports.createItem = async (req, res, next) => {
  try {
    const { username, role, id } = req.user;

    const { title, description, location, category } = req.body;
    const files = req.files;

    if (
      !req.files ||
      req.files.length === 0 ||
      !(title && description && location && category)
    ) {
      console.log(`${req.body}\n ${req.files}`);
      return next(
        new AppError(
          "title,description,location,category and images should be submitted",
          400,
        ),
      );
    }
    const promisedImage = await updateImage(files, null);
    console.log(promisedImage);
    const createdItem = await Item.create({
      title,
      description,
      location,
      category,
      uploader: id,
      images: promisedImage,
    });

    res.status(200).json({
      success: true,
      message: "item created successfully",
      data: createdItem,
    });
  } catch (error) {
    if (req.files && req.files.length !== 0) {
      req.files.forEach((file) => {
        unlinkImage(file.path);
      });
    }
    next(new AppError(`error in create item ${error.message}`, 500));
  }
};

exports.updateForm = async (req, res) => {
  res.status(200).json({ csrf: generateCsrfToken(req, res) });
};
exports.updateItem = async (req, res, next) => {
  try {
    const files = req.files;
    const item = req.item;
    const allowedUpdate = ["title", "description", "category", "location"];
    if (Object.keys(req.body).length === 0 && files.length === 0) {
      return next(new AppError("Nothing to update", 400));
    }
    const updateData = {};
    Object.keys(req.body).forEach((i) => {
      if (allowedUpdate.includes(i)) {
        updateData[i] = req.body[i];
      }
    });
    if (files && files.length >= 1) {
      await deleteImage(item);
      updateData.images = await updateImage(files, item.id);
      Object.assign(item, updateData);
      const updatedItem = await item.save();
      res.status(200).json({
        success: true,
        message: "item updated successfully",
        data: updatedItem,
      });
    }
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        unlinkImage(file.path); // Use .path, not .filepath
      });
    }

    next(new AppError(`error in update item ${error.message}`, 500));
  }
};
const deletePost = async (req, res, next) => {
  try {
    const id = req.params?.id;
    const item = await Item.findByIdAndUpdate(id, { isDeleted: true });
    res.status(200).json({
      success: true,
      message: "item deleted successfully",
    });
  } catch (error) {
    next(new AppError(`error in delete item ${error.message}`, 500));
  }
};
