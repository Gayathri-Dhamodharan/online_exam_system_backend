const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    userId: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      role: {
        type: String,
        enum: ["admin", "student"], // whatever roles you allow
        required: true,
        default: "admin", // if you always want admin
      },
    },
    class: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    subject: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    questionType: {
      type: String,
      enum: ["MCQ", "True/False"],
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    questionOptions: {
      type: [String],
      default: undefined,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    marks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
