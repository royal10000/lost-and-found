const { verifyPost, itemStatus } = require("../controllers/admin.controller");
const isAdmin = require("../middlewares/isAdmin.middleware");
const authVerify = require("../middlewares/jwt.middleware");

const router = require("express").Router();
router.get("/", authVerify, isAdmin, (req, res, next) => {
  res.send("welcome Admmin");
});

router.post("/verify", authVerify, isAdmin, verifyPost);
router.post("/status", authVerify, isAdmin, itemStatus);
