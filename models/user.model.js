const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username should be unique"],
      minLength: [4, "minimum length of username should be 4"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email should be unique"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
      type: String,
      select: false,
      required: [true, "password is required"],
      minLength: [4, "minimum length of password is 4"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
