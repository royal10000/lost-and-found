const {
  allitems,
  singleItem,
  createItemForm,
  createItem,
  updateItemForm,
  items,
} = require("../controllers/item.controller");
const authVerify = require("../middlewares/jwt.middleware");
const upload = require("../middlewares/multer.middleware");

const router = require("express").Router();

router.get("/", allitems);
router.get("/:category", allitems);
router.get("/:id/:slug", singleItem);
router.get("/create", authVerify, createItemForm);
router.post(
  "/create",
  authVerify,
  upload.array("image", 3),
  createItem,
);

// router.get("/update", authVerify, updateItemForm);
// router.patch(
//   "/update",
//   authVerify,
//   upload.array("itemImage", 3),
//   createItem,
// );



module.exports = router;
