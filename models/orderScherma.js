const mongoose = require("mongoose");
const Product=require("./productSchema")

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  items: [{type:OrderItemSchema,require:true}],
  status: {
    type: String,
    enum: ["Creado", "En Curso", "En Camino", "Entregado"],
    default: "Creado",
  },
  totalAmount: { type: Number, required: true },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
});

OrderSchema.pre('save', async function(next) {
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
