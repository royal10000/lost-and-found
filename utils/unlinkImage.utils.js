const fs = require("fs");
const path = require("path");

const unlinkImage = (img) => {
  // Use path.join for better cross-platform compatibility
  const imagePath = path.resolve(__dirname, "..", img);

  if (!fs.existsSync(imagePath)) {
    console.log("Image already missing from server:", img);
    return true; // Return true because the goal (file gone) is met
  }

  try {
    fs.unlinkSync(imagePath);
    return true;
  } catch (error) {
    console.error("Error while deleting image from storage:", error.message);
    return false;
  }
};

module.exports = unlinkImage;
