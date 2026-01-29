const {
  loginForm,
  signupForm,
  singup,
  logout,
  login,
} = require("../controllers/auth.controller");

const router = require("express").Router();
router.get("/login", loginForm);
router.post("/post", login);
router.get("/signup", signupForm);
router.post("/login", singup);
router.post("/logout", logout);
module.exports = router;
