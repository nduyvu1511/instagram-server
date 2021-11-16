const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Post = new Schema(
  {
    title: { type: String, required: true },
    user_id: { type: String, required: true },
    likes: { type: Number, min: 0, default: 0 },
    images: { type: Array, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Post", Post)
