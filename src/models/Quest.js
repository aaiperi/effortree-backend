const mongoose = require("mongoose");

const QuestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    subject: String,
    topic: String,

    effort_type: {
      type: String,
      enum: ["focus_time", "problem_set", "reading", "custom"],
      default: "focus_time",
    },

    studied_minutes: { type: Number, default: 0 },
    suggested_minutes: { type: Number, default: 20 },

    deadline: Date,

    visibility: {
      type: String,
      enum: ["private", "shared"],
      default: "private",
    },

    status: {
      type: String,
      enum: ["prepare", "active", "done"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quest", QuestSchema);
