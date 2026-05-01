const mongoose = require("mongoose");

const tutorOfferSchema = new mongoose.Schema(
  {
    moduleCode: { type: String, required: true, trim: true, uppercase: true, maxlength: 20 },
    type: { type: String, enum: ["offer", "request"], required: true },
    hourlyRate: { type: Number, default: 0, min: 0 },
    availability: { type: String, default: "", maxlength: 200 },
    description: { type: String, default: "", maxlength: 1000 },
    status: { type: String, enum: ["active", "closed"], default: "active" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

tutorOfferSchema.index({ description: "text", moduleCode: "text" });

module.exports = mongoose.model("TutorOffer", tutorOfferSchema);
