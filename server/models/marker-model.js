const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Marker = new Schema({
  area: { type: String, required: true },
  category: { type: String, require: true },
  type: { type: String, required: false },
  coord: { type: [Number], required: true },
  title: { type: String, required: true },
  descriptions: { type: [String], required: true },
});

module.exports = mongoose.model("markers", Marker);
