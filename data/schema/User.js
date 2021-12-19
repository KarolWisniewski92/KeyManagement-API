const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    phone: Number,
    email: String,
    user_id: String,
    password: String,
    isActive: Boolean,
    role: String
});

module.exports = mongoose.model('User', userSchema);