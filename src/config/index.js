const mongoose = require("mongoose")

const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/instagram", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("connected")
  } catch (error) {
    console.log("failed")
  }
}

module.exports = { connect }
