const mongoose = require("mongoose");
const Product = require("./productSchema");

const OrderItemSchema = new mongoose.Schema({
  //Producto
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  //Cantidad
  quantity: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  //Dueño del pedido
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  //Restaurante
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    immutable: true,
  },
  //Repartidor
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  //Productos
  items: [{ type: OrderItemSchema, require: true }],
  //Estado del pedido
  status: {
    type: String,
    enum: ["Creado", "En Curso", "En Camino", "Entregado"],
    default: "Creado",
  },
  //Valoracion
  rating: { type: Number, default: 0, min: 0, max: 5 },
  //Valor total
  totalAmount: { type: Number, required: true },
  //Habilitado
  isActive: {
    type: Boolean,
    default: true,
  },
  //Fecha de creacion
  createdAt: { type: Date, default: Date.now },
});

//Calcular total al guardar
OrderSchema.pre("save", async function (next) {
  const order = this;

  let total = 0;

  for (let item of order.items) {
    const product = await Product.findById(item.productId);
    total += product.price * item.quantity;
  }

  order.totalAmount = total;

  next();
});

module.exports = mongoose.model("Order", OrderSchema);
