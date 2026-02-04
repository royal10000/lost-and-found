const mongoose = require("mongoose");
const slugify = require("slugify"); // Removed { default: slugify } as standard require is usually enough

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: {
      type: String,
      index: true,
    },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["lost", "found"],
      required: true,
      index: true,
    },
    images: {
      type: [{ path: { type: String }, hash: { type: String } }],
    },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "claimed", "closed"],
      default: "open",
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
  },
  { timestamps: true },
);

// Search Index
itemSchema.index({ title: "text" });

itemSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();

  try {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    this.slug = `${Date.now()}-${baseSlug}`;
    next();
  } catch (err) {
    next(err); // Pass error to Mongoose
  }
});

module.exports = mongoose.model("Item", itemSchema);
