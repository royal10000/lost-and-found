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
    isApproved: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Search Index
itemSchema.index({ title: "text", "images.hash": 1 });

itemSchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  this.slug = `${Date.now()}-${baseSlug}`;
});

module.exports = mongoose.model("Item", itemSchema);
