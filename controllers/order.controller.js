const Product = require("../models/productSchema");
const Order = require("../models/orderScherma");
const Restaurant = require("../models/restaurantSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

//Obtener todos los pedidos o los pedidos realizados por un usuario, enviados por un usuario, pedidos de un restaurante o pedidos entre dos fechas
const getOrders = async (req, res) => {
  try {
    const { userId, restaurantId, startDate, endDate, deliveryId } = req.query;

    const query = { isActive: true };
    if (userId) query.userId = userId;
    if (deliveryId) query.deliveryId = deliveryId;
    if (restaurantId) query.restaurantId = restaurantId;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(query);

    res.json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Obtener los pedidos enviados
const getDeliveredOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "En Camino", isActive: true });

    res.json(orders);
  } catch (error) {}
};

//Obtener el pedido por el ID
const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, isActive: true });

    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//Crear pedido
const createOrder = async (req, res) => {
  try {
    const order = req.body;

    const user = await User.findOne({
      _id: order.userId,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({ message: `Usuario no encontrado` });
    }

    const restaurant = await User.findOne({
      _id: order.restaurantId,
      isActive: true,
    });

    if (!restaurant) {
      return res.status(404).json({ message: `restaurante no encontrado` });
    }

    order.items.forEach(async (element) => {
      const product = await Product.findOne({
        _id: element.productId,
        isActive: true,
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: `producto ${element.productId} no encontrado` });
      }
    });

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({ message: "Pedido creado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el pedido", error: error.message });
  }
};

//Actualizar pedido
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const {userId,restaurantId,items,totalAmount,...updates}=req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    if (order.status === "Enviado") {
      return res
        .status(400)
        .json({ error: "No se puede modificar un pedido en estado 'Enviado'" });
    }

    Object.assign(order, updates);
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json(error);
  }
};

//Inhabilitar pedido
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndUpdate(orderId,{isActive:false});
    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json({ message: "Pedido inhabilitado" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createOrder,
  deleteOrder,
  getDeliveredOrders,
  getOrder,
  getOrders,
  updateOrder,
};
