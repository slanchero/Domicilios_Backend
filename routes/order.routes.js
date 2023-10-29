const { Router } = require("express");

const {
  createOrder,
  deleteOrder,
  getDeliveredOrders,
  getOrder,
  getOrders,
  updateOrder,
} = require("../controllers/order.controller");

const router = Router();

router.get("/", getOrders);

router.get("/delivered", getDeliveredOrders);

router.get("/:id", getOrder);

router.post("/", createOrder);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

module.exports = router;
