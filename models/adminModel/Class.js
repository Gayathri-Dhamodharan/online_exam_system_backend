const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      "1","2","3","4",
      "5","6","7","8",
      "9","10"
    ]
  },
}, {
  timestamps: true
});

classSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Class", classSchema);
