import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    // ⭐ PIN FEATURE
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Question = mongoose.model("Question", questionsSchema);

export default Question;
