const { Router } = require("express");

const {
  createRestaurant,
  deleteRestaurant,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
} = require("../controllers/restaurant.controller");

const router = Router();

router.get("/", getRestaurants);

router.get("/:id", getRestaurant);

router.post("/", createRestaurant);

router.put("/:id", updateRestaurant);

router.delete("/:id", deleteRestaurant);

module.exports = router;
