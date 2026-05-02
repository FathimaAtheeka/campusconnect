const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 1000 },
    type: { type: String, enum: ["lost", "found"], required: true },
    category: { type: String, default: "other", maxlength: 50 },
    location: { type: String, default: "", maxlength: 120 },
    imageUrl: { type: String, default: "" },
    status: { type: String, enum: ["open", "claimed"], default: "open" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    claimedAt: { type: Date },
  },
  { timestamps: true }
);

itemSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Item", itemSchema);
