const User = require("../models/userSchema");
const mongoose=require("mongoose");

//Obtener todos los usuarios o obtener usuario por correo y contraseña
const getUsers = async (req, res) => {
  const { email, password } = req.query;

  if (email != undefined && password != undefined) {
    try {
      const user = await User.findOne({ email: email, password: password, isActive:true }).select("-password");
      if (!user) {
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
    const users = await User.find({isActive:true}).select("-password");
    res.json(users);
  }
};

//Obtener Usuarios por ID
const getUserID = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({_id:userId,isActive:true}).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar usuario" });
  }
};

//Crear usuario
const createUser = async (req, res) => {
  const user = req.body;

  try {
    const newUser = new User(user);
    await newUser.save();

    // const newAddress = new Address({ ...address, userId: newUser._id });
    // newAddress.save();

    // newUser.addresses.push(newAddress._id);

    // newUser.save();

    res.status(201).json({message:"Usuario creado"});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear usuario", error: err.message });
  }
};

//Actualizar un usuario
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({message:"Usuario actualizado"});
  } catch (error) {
    res.status(400).json({error:error});
  }
};

//Inhabilitar un usuario
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(userId,{isActive:false});

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // await Address.updateMany({ userId: userId }, { isActive: false });

    res.json({message:"Usuario inhabilitado"});
  } catch (error) {
    res.status(500).json({error:error});
  }
};

module.exports = { getUsers, getUserID, createUser, updateUser, deleteUser };
