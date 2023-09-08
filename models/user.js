const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: [{ type: String, required: true }],
});

UsersSchema.virtual('url').get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UsersSchema);
