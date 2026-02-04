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
router.get("/create-post", authVerify, createItemForm);
router.post(
  "/create-post",
  authVerify,
  upload.array("itemImage", 3),
  createItem,
);
router.post(
  "/create",
  authVerify,
  upload.array("itemImage", 3),
  items,
);
// router.get("/update-post", authVerify, updateItemForm);
// router.patch(
//   "/update-post",
//   authVerify,
//   upload.array("itemImage", 3),
//   createItem,
// );
// router.get("/")

module.exports = router;
