const User = require("../models/userSchema");
const Address = require("../models/addressSchema");
const mongoose=require("mongoose");

const getUsers = async (req, res) => {
  const { email, password } = req.query;

  if (email != undefined && password != undefined) {
    try {
      const user = await User.find({ email: email, password: password, isActive:true }).lean();
      if (!user.length) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al buscar usuario" });
    }
  } else if ((email && !password) || (!email && password)) {
    return res.status(404).json({ message: "Credenciales Incompletas" });
  } else {
    const users = await User.find({isActive:true});
    res.json(users);
  }
};

const getUserID = async (req, res) => {
  const userId = req.params.id;

  try {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .send({ message: "El ID de usuario no es válido." });
    }

    const user = await User.findOne({_id:userId,isActive:true}).lean();
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar usuario" });
  }
};

const createUser = async (req, res) => {
  const { email, name, password, phoneNumber, address, role } = req.body;

  try {
    const newUser = new User({ name, email, password, phoneNumber, role });
    await newUser.save();

    const newAddress = new Address({ ...address, userId: newUser._id });
    newAddress.save();

    newUser.addresses.push(newAddress._id);

    newUser.save();

    res.status(201).json({message:"Usuario creado"});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear usuario", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let message={message:"Usuario actualizado"};

    const userId = req.params.id;
    const { addresses, address, ...updates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .send({ message: "El ID de usuario no es válido." });
    }

    if(address||addresses){
      message["noUpdate"]="direcciones no actualizadas";
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    res.json(message);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .send({ message: "El ID de usuario no es válido." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    await Address.updateMany({ userId: userId }, { isActive: false });

    user=await User.findByIdAndUpdate(userId, { isActive: false });

    res.json({message:"Usuario inhabilitado"});
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getUsers, getUserID, createUser, updateUser, deleteUser };
