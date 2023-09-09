const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
});

PostsSchema.virtual('url').get(function () {
  return `/post/${this._id}`;
});

module.exports = mongoose.model('Post', PostsSchema);
