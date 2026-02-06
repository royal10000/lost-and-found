const { generateCsrfToken } = require("../middlewares/csrf.middleware");
const Item = require("../models/items.model");
const AppError = require("../utils/AppError.utils");
const imageHash = require("../utils/generateImageHash.utils");
const unlinkImage = require("../utils/unlinkImage.utils");

exports.allitems = async (req, res, next) => {
  try {
    const category = req.params?.category || "";

    const items = await Item.find({ category: category }).populate("uploader");
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
    const item = await Item.findById(id);
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
      return next(
        new AppError(
          "title,description,location,category and images should be submitted",
          400,
        ),
      );
    }

    const promisedImage = await Promise.all(
      files.map(async (file) => {
        const hashedimage = await imageHash(file.path);
        // console.log(file.path)
        const duplicate = await Item.findOne({ "images.hash": hashedimage });
        console.log(duplicate)
        if (duplicate) {
          const existingPath = duplicate.images.find(
            (img) => img.hash === hashedimage,
          ).img;
          unlinkImage(file.path);
          console.log(existingPath)

          return { img: existingPath, hash: hashedimage };
        }
        return { img: file.path, hash: hashedimage };
      }),
    );
    // console.log(promisedImage);
    // const imageData = req.files.map((file, index) => ({
    //   path: file.path,
    //   hash: promisedImage[index],
    // }));
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
    // const
  } catch (error) {
    if (req.files && req.files.length !== 0) {
      req.files.forEach((file) => {
        unlinkImage(file.path);
      });
    }
    next(new AppError(`error in create item ${error.message}`, 500));
  }
};
exports.updateItem = async (req, res, next) => {};

exports.items = async (req, res, next) => {
  console.log(next);
  try {
    const item = new Item({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      uploader: req.user.id,
    });

    await item.save();

    res.status(200).json({ data: item });
  } catch (error) {
    next(new AppError(error.message || "error with this", 500));
  }
};
