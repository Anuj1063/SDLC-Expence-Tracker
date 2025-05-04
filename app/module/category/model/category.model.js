const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  icon: { type: String, default: null, required: false },
});

module.exports = mongoose.model('Category', categorySchema);
