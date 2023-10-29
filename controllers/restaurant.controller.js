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

      if (!mongoose.Types.ObjectId.isValid(req.query.ownerId)) {
        return res
          .status(400)
          .send({ message: "El ID de usuario no es válido." });
      }

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

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(400)
        .send({ message: "El ID de restaurante no es válido." });
    }

    const restaurant = await Restaurant.findOne({_id:restaurantId,
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

    res.status(201).json({message:"Restaurante creado"});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear restaurante", error: err.message });
  }
};


const updateRestaurant = async (req, res) => {
  try {
    let message={message:"Restaurante actualizado"};

    const restaurantId = req.params.id;
    const {ownerId,...updates} = req.body;

    if(ownerId){
      if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        return res
          .status(400)
          .send({ message: "El ID de usuario no es válido." });
      }
  
      const user = await User.findOne({
        _id: ownerId,
        isActive: true,
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      updates.ownerId=ownerId;
    }

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

    res.json(message);
  } catch (error) {
    res.status(400).json({error:error});
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(400)
        .send({ message: "El ID de restaurante no es válido." });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, {
      isActive: false,
    });

    if (!restaurant) {
      return res.status(404).send({ error: "Restaurante no encontrado" });
    }

    res.send({ message: "Restaurante inhabilitado con éxito" });
  } catch (error) {
    res.status(500).json({error:error});
  }
};

module.exports = {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  getRestaurant,
  getRestaurants,
};
