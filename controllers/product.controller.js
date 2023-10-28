const Product = require("../models/productSchema");
const Restaurant = require("../models/restaurantSchema");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    let query = {};

    if (req.query.category) {
      const categories = req.query.category.split(",");
      console.log(categories);
      query.categories = { $in: categories };
    }

    if (req.query.restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.restaurantId)) {
        return res
          .status(400)
          .send({ message: "El ID de restaurante no es válido." });
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

const getProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .send({ message: "El ID de producto no es válido." });
    }

    const product = await Product.findById(productId, {
      isActive: true,
    }).lean();
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar el producto" });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(product.restaurantId)) {
      return res
        .status(400)
        .send({ message: "El ID de restaurante no es válido." });
    }

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

const updateProduct = async (req, res) => {
  try {
    let message = { message: "Producto actualizado" };

    const productId = req.params.id;
    const { restaurantId, ...updates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(400)
        .send({ message: "El ID de restaurante no es válido." });
    }

    if (restaurantId) {
      message["npUpdate"] = "El Restaurante no se puede cambiar";
    }

    const product = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    if (!product) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .send({ message: "El ID de producto no es válido." });
    }

    const product = await Product.findByIdAndUpdate(productId, {
      isActive: false,
    });

    if (!product) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    res.send({ message: "Producto inhabilitado con éxito" });
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
