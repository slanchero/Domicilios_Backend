const mongoose = require("mongoose");

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex = /(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/;
const phoneNumberRegex = /^\+\d{1,3}\s?\d{6,14}$/;

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
  name: {
    firstName:{type:String,required:true,minLength:1},
    secondName:{type:String,minLength:1},
    lastNames:{type:String,required:true,minLength:1}
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return passwordRegex.test(value);
      },
      message:
        "La contraseña debe contener al menos un número y por lo menos una letra",
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return phoneNumberRegex.test(value);
      },
      message: `${props.value} no es un número de teléfono válido!`,
    },
  },
  addresses: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  role: { type: String, enum: ["cliente", "administrador"], required: true },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
