const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    label: { type: String }  // ej. "Casa", "Trabajo", etc.
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    addresses: [AddressSchema],
    role: { type: String, enum: ['cliente', 'administrador'], required: true }
});

module.exports = mongoose.model('User', UserSchema);
