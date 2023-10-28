const Product = require("../models/productSchema");
const Order = require("../models/orderScherma");
const Restaurant = require("../models/restaurantSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

const getOrders = async (req, res) => {
  try {
    const { userId, restaurantId, startDate, endDate } = req.query;

    const query = {};
    if (userId) query.userId = userId;
    if (restaurantId) query.restaurantId = restaurantId;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(restaurantId)
    ) {
      return res
        .status(400)
        .send({ message: "El ID de Usuario o Restaurante no es válido." });
    }

    const orders = await Order.find(query);

    res.json(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDeliveredOrders = async (req, res) => {
  try {
    const order = await Order.find({status:"En Camino", isActive: true });

    res.json(order);
  } catch (error) {}
};

const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .send({ message: "El ID del pedido no es válido." });
    }

    const order = await Order.findOne({ _id: orderId, isActive: true });

    if (!order) {
      return res.status(404).send({ error: "Pedido no encontrado" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createOrder = async (req, res) => {
  try {
    const order = req.body;

    if (!mongoose.Types.ObjectId.isValid(order.userId)) {
      return res
        .status(400)
        .send({ message: "El ID de usuario no es válido." });
    }

    const user = await User.findOne({
      _id: order.userId,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({ message: `Usuario no encontrado` });
    }

    if (!mongoose.Types.ObjectId.isValid(order.restaurantId)) {
      return res
        .status(400)
        .send({ message: "El ID de restaurante no es válido." });
    }

    const restaurant = await User.findOne({
      _id: order.restaurantId,
      isActive: true,
    });

    if (!restaurant) {
      return res.status(404).json({ message: `restaurante no encontrado` });
    }

    order.items.forEach(async (element) => {
      if (!mongoose.Types.ObjectId.isValid(element.productId)) {
        return res.status(400).send({
          message: `El ID de producto ${element.productId} no es válido.`,
        });
      } else {
        const product = await Product.findOne({
          _id: element.productId,
          isActive: true,
        });

        if (!product) {
          return res
            .status(404)
            .json({ message: `producto ${element.productId} no encontrado` });
        }
      }
    });

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({ message: "Pedido creada" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el pedido", error: error.message });
  }
};

// const updateProduct = async (req, res) => {
//   try {
//     let message = { message: "Producto actualizado" };

//     const productId = req.params.id;
//     const { restaurantId, ...updates } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
//       return res
//         .status(400)
//         .send({ message: "El ID de restaurante no es válido." });
//     }

//     if (restaurantId) {
//       message["npUpdate"] = "El Restaurante no se puede cambiar";
//     }

//     const product = await Product.findByIdAndUpdate(productId, updates, {
//       new: true,
//     });

//     if (!product) {
//       return res.status(404).send({ error: "Producto no encontrado" });
//     }

//     res.json(message);
//   } catch (error) {
//     res.status(400).json({ error: error });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res
//         .status(400)
//         .send({ message: "El ID de producto no es válido." });
//     }

//     const product = await Product.findByIdAndUpdate(productId, {
//       isActive: false,
//     });

//     if (!product) {
//       return res.status(404).send({ error: "Producto no encontrado" });
//     }

//     res.send({ message: "Producto inhabilitado con éxito" });
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };

module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
};
