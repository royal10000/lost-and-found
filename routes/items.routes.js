const {
  allitems,
  singleItem,
  createItemForm,
  createItem,
  updateItem,
  updateForm,
} = require("../controllers/item.controller");
const isOwner = require("../middlewares/isOwner.middleware");
const authVerify = require("../middlewares/jwt.middleware");
const upload = require("../middlewares/multer.middleware");

const router = require("express").Router();

router.get("/", allitems);
router.get("/:category", allitems);
router.get("/:id/:slug", singleItem);
router.get("/create", authVerify, createItemForm);
router.post("/create", authVerify, upload.array("image", 3), createItem);
router.get("/update/:id", authVerify, isOwner, updateForm);
router.patch("/update/:id", authVerify, isOwner,upload.array("image",3), updateItem);
router.delete("/delete/:id", authVerify, isOwner, updateItem);


module.exports = router;
