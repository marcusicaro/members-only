const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: [{ originalName: String, path: String }],
});

UsersSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model('Category', UsersSchema);
