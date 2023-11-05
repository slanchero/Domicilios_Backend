const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  //nombre del producto
  name: { type: String, required: true },
  //Descripcion del producto
  description: { type: String },
  //Categorias del producto
  categories: [{ type: String, required: true }],
  //precio del producto
  price: { type: Number, required: true },
  //Restaurante al que pertenece el producto
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    immutable: true,
  },
  //Habilitado
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", ProductSchema);
