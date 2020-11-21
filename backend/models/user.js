const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// Schema requis pour la connexion //
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);