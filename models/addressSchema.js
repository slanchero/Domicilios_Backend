const mongoose = require("mongoose");
const User = require("../models/userSchema");

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  label: { type: String }, // ej. "Casa", "Trabajo", etc.
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Address", AddressSchema);
