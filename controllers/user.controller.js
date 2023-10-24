const User = require("../models/userSchema");

const getUsers = async (req, res) => {
  const { email, password } = req.query;

  if (email != undefined && password != undefined) {
    try {
      const user = await User.find({ email: email, password: password }).lean();
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
    const users = await User.find();
    res.json(users);
  }
};

const getUserID = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).lean();
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
  const userData = req.body;

  try {
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear usuario", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getUsers, getUserID, createUser, updateUser, deleteUser };
