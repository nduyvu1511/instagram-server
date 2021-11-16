const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comment = new Schema(
  {
    title: { type: String, minlength: 1, required: true },
    user_id: { type: String },
    post_id: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Comment", Comment)
