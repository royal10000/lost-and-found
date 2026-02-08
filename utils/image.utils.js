const Item = require("../models/items.model");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { pipeline } = require("stream/promises");
const AppError = require("./AppError.utils");
/**
 * Generates an MD5 hash of a file's content
 * @param {string} filePath - The absolute or relative path to the file
 * @returns {Promise<string>} - The hex-encoded hash string
 */

exports.imageHash = async (img) => {
  const hash = crypto.createHash("md5");
  const filestream = fs.createReadStream(img);
  try {
    await pipeline(filestream, hash);
    return hash.digest("hex");
  } catch (error) {
    next(new AppError("error while creating image hash", error));
  }
};

exports.unlinkImage = async (img) => {
  // Use path.join for better cross-platform compatibility
  const imagePath = path.resolve(__dirname, "..", img);

  if (!fs.existsSync(imagePath)) {
    console.log("Image already missing from server:", img);
    return true; // Return true because the goal (file gone) is met
  }

  try {
    await fs.promises.unlink(imagePath);
    return true;
  } catch (error) {
    console.error("Error while deleting image from storage:", error.message);
    return false;
  }
};
exports.updateImage = (files, _id) => {
  return Promise.all(
    files.map(async (file) => {
      const hashedImage = await this.imageHash(file.path);
      const query = {
        "images.hash": hashedImage,
      };

      if (_id) {
        query._id = { $ne: _id };
      }
      const duplicateItem = await Item.findOne(query);

      if (duplicateItem) {
        const existing = duplicateItem.images.find(
          (img) => img.hash === hashedImage,
        );

        await this.unlinkImage(file.path);
        return existing;
      }

      return {
        path: file.path,
        hash: hashedImage,
      };
    }),
  );
};

exports.deleteImage = (item) => {
  const oldHashes = [
    ...new Set(
      item.images.map((img) => {
        return img.hash;
      }),
    ),
  ];
  return Promise.all(
    oldHashes.map(async (hash) => {
      const usedElsewhere = await Item.findOne({
        _id: { $ne: item.id },
        "images.hash": hash,
      });
      if (!usedElsewhere) {
        const img = item.images.find((img) => img.hash === hash);
        if (img) await this.unlinkImage(img.path);
      }
    }),
  );
};
