const mongoose = require("mongoose");
const { schema } = require("./user.model");
const { default: slugify } = require("slugify");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: {
      type: String,
    },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    image: { type: String },

    location: { type: String },

    status: {
      type: String,
      enum: ["open", "claimed", "closed"],
      default: "open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ NEW: Admin verification system
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin user id
    },

    verifiedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

itemSchema.pre("save", function (req, res, next) {
  if (!this.isModified("title")) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  this.slug = `${Date.now()}-${baseSlug}`;

  next();
});
module.exports = mongoose.model("Item", itemSchema);
