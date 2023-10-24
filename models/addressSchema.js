const mongoose = require("mongoose");
const User = require("../models/userSchema");

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" ,required:true},
  label: { type: String }, // ej. "Casa", "Trabajo", etc.
});

AddressSchema.pre('save', async function(next){
    try {
        const address = this;

        const user = await User.findById(address.userId);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Address", AddressSchema);
