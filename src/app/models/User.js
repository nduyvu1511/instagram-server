const mongoose = require("mongoose")
const Schema = mongoose.Schema

const validateEmail = function (email) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return regex.test(email)
}

const validatePassword = function (password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  return regex.test(password)
}

const User = new Schema(
  {
    name: { type: String, min: 1 },
    user_name: { type: String, required: true, min: 1 },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 20,
      validate: [
        validatePassword,
        "Password has Minimum eight characters, at least one letter, one number and one special character",
      ],
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password has Minimum eight characters, at least one letter, one number and one special character",
      ],
    },
    description: { type: String, default: "" },
    avatar: { type: String, default: "" },
    gender: { type: Boolean, default: true },
    following_ids: { type: Array, default: [] },
    post_ids: { type: Array, default: [] },
    comment_ids: { type: Array, default: [] },
    liked_post_id: { type: Array, default: [] },
    is_followed_by_ids: { type: Array, default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", User)
