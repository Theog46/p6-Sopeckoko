const mongoose = require('mongoose');

// Schema d'une sauce exporté dans MongoDB //
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, require: true},
  description: { type: String, required: true },
  mainPepper: { type: String, required: true},
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true},
  likes: { type: Number, default: 0},
  dislikes: { type: Number, default: 0},
  userId: { type: String, require: true},
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]},
});

module.exports = mongoose.model('Sauce', sauceSchema);