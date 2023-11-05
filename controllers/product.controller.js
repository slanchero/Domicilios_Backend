const Product = require("../models/productSchema");
const Restaurant = require("../models/restaurantSchema");
const mongoose = require("mongoose");

//Obtener todos los productos o obtener los productos de algun restaurante o categoria
const getProducts = async (req, res) => {
  try {
    let query = {};

    if (req.query.category) {
      const categories = req.query.category.split(",");
      query.categories = { $in: categories };
    }

    if (req.query.restaurantId) {
      const restaurant = await Restaurant.findOne({
        _id: req.query.restaurantId,
        isActive: true,
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurante no encontrado" });
      }
      query.restaurantId = req.query.restaurantId;
    }

    const products = await Product.find({ isActive: true, ...query });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar el productos" });
  }
};

//Obtener el producto por ID
const getProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar el producto" });
  }
};

//Crear producto
const createProduct = async (req, res) => {
  try {
    const product = req.body;

    const restaurant = await Restaurant.findOne({
      _id: product.restaurantId,
      isActive: true,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    const newProduct = new Product(product);
    newProduct.save();

    res.status(201).json({ message: "Producto creado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear producto", error: err.message });
  }
};

//Actualizar producto
const updateProduct = async (req, res) => {
  try {
    let message = { message: "Producto actualizado" };

    const productId = req.params.id;
    const { restaurantId, ...updates } = req.body;

    if (restaurantId) {
      message["noUpdate"] = "El Restaurante no se puede cambiar";
    }

    const product = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

//Inhabilitar un producto
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(productId, {
      isActive: false,
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto inhabilitado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
};
