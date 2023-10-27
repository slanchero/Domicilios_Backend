const Restaurant = require("../models/restaurantSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

const getRestaurants = async (req, res) => {
  try {
    let query = {};

    if (req.query.category) {
      const categories = req.query.category.split(",");
      console.log(categories);
      query.categories = { $in: categories };
    }

    if (req.query.name) {
      query.name = new RegExp(req.query.name, "i");
    }

    if (req.query.ownerId) {
      query.ownerId = req.query.ownerId;
    }

    const restaurants = await Restaurant.find({ isActive: true, ...query });

    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar el restaurantes" });
  }
};

const getRestaurant = async (req, res) => {
  const restaurantId = req.params.id;

  try {
    const restaurant = await Restaurant.findById(restaurantId, {
      isActive: true,
    }).lean();
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar el restaurante" });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const restaurant = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurant.ownerId)) {
      return res
        .status(400)
        .send({ message: "El ID de usuario no es válido." });
    }

    const user = await User.findOne({
      _id: restaurant.ownerId,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const newRestaurant = new Restaurant(restaurant);
    newRestaurant.save();

    res.status(201).json(newRestaurant);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear restaurante", error: err.message });
  }
};


//arreglar aqui
const updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const updates = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updates,
      {
        new: true,
      }
    );

    if (!restaurant) {
      return res.status(404).send({ error: "Restaurante no encontrado" });
    }

    res.send(restaurant);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, {
      isActive: false,
    });

    if (!restaurant) {
      return res.status(404).send({ error: "Restaurante no encontrado" });
    }

    res.send({ message: "Restaurante inhabilitado con éxito" });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  getRestaurant,
  getRestaurants,
};
