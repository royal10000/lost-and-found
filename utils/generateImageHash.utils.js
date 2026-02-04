const crypto = require("crypto");
const fs = require("fs");
const { pipeline } = require("stream/promises");
const AppError = require("./AppError.utils");
/**
 * Generates an MD5 hash of a file's content
 * @param {string} filePath - The absolute or relative path to the file
 * @returns {Promise<string>} - The hex-encoded hash string
 */

const imageHash = async (img) => {
  const hash = crypto.createHash("md5");
  const filestream = fs.createReadStream(img);
  try {
    await pipeline(filestream, hash);
    return hash.digest("hex");
  } catch (error) {
    console.log("Error while creating hash image",error.message)
  }
};

module.exports = imageHash;
