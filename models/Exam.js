// models/Exam.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const GRADE_ENUM = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const examSchema = new Schema(
  {
    // Who created/launched the exam
    createdBy: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      role: {
        type: String,
        enum: ["admin", "student"],
        required: true,
      },
    },

    // Target class & subject
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

    // Duration & schedule
    duration: {
      type: Number, // in minutes
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // “HH:mm” 24-hour format
      required: true,
      validate: {
        validator: (v) => /^\d{2}:\d{2}$/.test(v),
        message: (props) =>
          `${props.value} is not a valid time (expected HH:mm)`,
      },
    },

    // Questions array
    selectedQuestions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],

    // Computed fields
    totalMark: {
      type: Number,
      default: 0,
    },
    passMark: {
      type: Number,
      default: 0,
    },

    // Show answers/results after submission?
    isPostValidation: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: combine startDate + startTime into a single Date
examSchema
  .virtual("startDateTime")
  .get(function () {
    if (!this.startDate || !this.startTime) return null;
    const datePart = this.startDate.toISOString().slice(0, 10);
    return new Date(`${datePart}T${this.startTime}:00`);
  })
  .set(function (dt) {
    const d = dt instanceof Date ? dt : new Date(dt);
    this.startDate = new Date(d.toISOString().slice(0, 10));
    const [h, m] = d.toTimeString().split(":");
    this.startTime = `${h}:${m}`;
  });

// Pre-save hook: calculate totalMark & passMark (25% rounded up)
examSchema.pre("save", function (next) {
  if (this.questions && this.questions.length) {
    const sum = this.questions.reduce((acc, q) => acc + (q.marks || 0), 0);
    this.totalMark = sum;
    this.passMark = Math.ceil(sum * 0.25);
  } else {
    this.totalMark = 0;
    this.passMark = 0;
  }
  next();
});

module.exports = mongoose.model("Exam", examSchema);
