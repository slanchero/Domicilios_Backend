const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  //Nombre de restaurante
  name: { type: String, required: true },
  //Direccion
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  //Categorias
  categories: [{ type: String, required: true }],
  //Popularidad
  rating: { type: Number, default: 0, min: 0, max: 5 },
  //Menu
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  //Administrador
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //Pedidos
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pedido" }],
  //Habilitado
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
