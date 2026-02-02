const express = require("express");
const session = require("express-session");
const connectDB = require("./database/lost.db");
const errorHandler = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

connectDB();

const app = express();

// ====== Middlewares ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// ====== View engine ======
app.set("view engine", "ejs");

// ====== Session ======
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// ====== Routes ======
const authRouter = require("./routes/auth.routes");

app.use("/api/auth", authRouter);

// ====== Error middleware MUST be last ======
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
