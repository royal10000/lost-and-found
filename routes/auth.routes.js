const {
  singup,
  logout,
  login,
  signupForm,
  loginForm,
} = require("../controllers/auth.controller");
const {
  doubleCsrfProtection,
  generateCsrfToken,
} = require("../middlewares/csrf.middleware");
const authVerify = require("../middlewares/jwt.middleware");

const router = require("express").Router();

router.get("/login", loginForm);
router.post("/login", login);
router.get("/signup", signupForm);
router.post("/signup", singup);
router.post("/logout", authVerify, logout);
module.exports = router;
