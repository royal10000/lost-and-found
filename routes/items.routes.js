const router = require("express").Router();

router.get("/", async (req, res) => {
  res.render("index", { page_title: "item" });
});