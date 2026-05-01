const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema(
  {
    moduleCode: { type: String, required: true, trim: true, uppercase: true, maxlength: 20 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", maxlength: 1000 },
    schedule: { type: String, default: "", maxlength: 200 },
    capacity: { type: Number, default: 10, min: 2, max: 100 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

studyGroupSchema.index({ title: "text", description: "text", moduleCode: "text" });

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
