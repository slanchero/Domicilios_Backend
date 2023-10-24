const mongoose = require("mongoose");

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return emailRegex.test(email);
      },
      message: (props) => `${props.value} no es un correo electrónico válido!`,
    },
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  role: { type: String, enum: ["cliente", "administrador"], required: true },
});

module.exports = mongoose.model("User", UserSchema);
