const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: [{ type: String, required: true }],
  price: { type: Number, required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", ProductSchema);
