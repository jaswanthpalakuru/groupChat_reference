const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    message: { type: String, required: true, min: 1, max: 250 },
    sender: { type: String, required: true, min: 1, max: 30 },
    room: { type: String, required: true, min: 1, max: 30 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", schema);
