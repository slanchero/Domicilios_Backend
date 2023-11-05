const Restaurant = require("../models/restaurantSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

//Obtener todos los restaurantes o restaurantes en una categoria, con nombre semejante o de un administrador
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

//Obtener restaurante por ID
const getRestaurant = async (req, res) => {
  const restaurantId = req.params.id;

  try {
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      isActive: true,
    });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al buscar el restaurante", error: err });
  }
};

//Crear un restaurante
const createRestaurant = async (req, res) => {
  try {
    const restaurant = req.body;

    const user = await User.findOne({
      _id: restaurant.ownerId,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const newRestaurant = new Restaurant(restaurant);
    newRestaurant.save();

    res.status(201).json({ message: "Restaurante creado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear restaurante", error: err.message });
  }
};

//Actualizar un restaurante
const updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const { ownerId, ...updates } = req.body;

    if (ownerId) {
      const user = await User.findOne({
        _id: ownerId,
        isActive: true,
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      updates.ownerId = ownerId;
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updates,
      {
        new: true,
      }
    );

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurante no encontrado" });
    }

    res.json({ message: "Restaurante actualizado" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al actualizar restaurante", error: error });
  }
};

//Inhabilitar un restaurante
const deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, {
      isActive: false,
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurante no encontrado" });
    }

    res.json({ message: "Restaurante inhabilitado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  getRestaurant,
  getRestaurants,
};
