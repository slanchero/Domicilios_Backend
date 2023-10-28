const Address = require("../models/addressSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({isActive:true});
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar direcciones" });
  }
};

const getAddress = async (req, res) => {
  const addressId = req.params.id;

  try {

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res
        .status(400)
        .send({ message: "El ID de direccion no es válido." });
    }

    const address = await Address.findOne({_id:addressId,isActive:true}).lean();
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

    if (!mongoose.Types.ObjectId.isValid(address.userId)) {
      return res
        .status(400)
        .send({ message: "El ID de usuario no es válido." });
    }

    const newAddress = new Address(address);
    newAddress.save();

    const user = await User.findOne({_id:newAddress.userId,isActive:true});
    
    if (!user) {
      await Address.findByIdAndDelete(newAddress._id);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    user.addresses.push(newAddress._id);
    await user.save();

    res.status(201).json({message:"Direccion creada"});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear direccion", error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    let message={message:"Direccion actualizada"};

    const addressId = req.params.id;
    const {userId,...updates} = req.body;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res
        .status(400)
        .send({ message: "El ID de restaurante no es válido." });
    }

    if(userId){message["npUpdate"]="El usuario no se puede cambiar"}

    const address = await Address.findByIdAndUpdate(addressId, updates, {
      new: true,
    });

    if (!address) {
      return res.status(404).send({ error: "Direccion no encontrado" });
    }

    res.json(message);
  } catch (error) {
    res.status(400).json({error:error});
  }
};

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res
        .status(400)
        .send({ message: "El ID de restaurante no es válido." });
    }

    const address = await Address.findByIdAndUpdate(addressId,{isActive:false});

    if (!address) {
      return res.status(404).send({ error: "Direccion no encontrada" });
    }

    const user = await User.findById(address.userId);
    if (user) {
      user.addresses.pull(addressId);
      await user.save();
    }

    res.json({message:"Direccion inhabilitada"});
  } catch (err) {
    res.status(500).json({error:err});
  }
};

module.exports = {
  getAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  createAddress,
};
