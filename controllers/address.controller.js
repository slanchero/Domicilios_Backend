const Address = require("../models/addressSchema");
const User = require("../models/userSchema");

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar direcciones" });
  }
};

const getAddress = async (req, res) => {
  const addressId = req.params.id;

  try {
    const address = await Address.findById(addressId).lean();
    if (!address) {
      return res.status(404).json({ message: "Direccion no encontrada" });
    }
    res.json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar direccion" });
  }
};

const createAddress = async (req, res) => {
  try {
    const address = req.body;

    const newAddress = new Address(address);
    newAddress.save();

    const user = await User.findById(newAddress.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    user.addresses.push(newAddress._id);
    await user.save();

    res.status(201).json(newAddress);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear direccion", error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updates = req.body;

    const address = await Address.findByIdAndUpdate(addressId, updates, {
      new: true,
    });

    if (!address) {
      return res.status(404).send({ error: "Direccion no encontrado" });
    }

    res.send(address);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    const address = await Address.findByIdAndDelete(addressId);

    if (!address) {
      return res.status(404).send({ error: "Direccion no encontrada" });
    }

    const user = await User.findById(address.userId);
    if (user) {
      user.addresses.pull(addressId);
      await user.save();
    }

    res.send(address);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  createAddress,
};
