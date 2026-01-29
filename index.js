const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const connectDB = require("./database/lost.db");
const errorHandler = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");

dotenv.config();
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
    secret: "hello world",
    saveUninitialized: false,
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
// app.use("/api/items", require("./routes/item.routes"));
// app.use("/api/user", require("./routes/user.routes"));
// app.use("/api/admin", require("./routes/admin.routes"));

// ====== Error middleware MUST be last ======
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
