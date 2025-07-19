const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    sizes: [sizeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
