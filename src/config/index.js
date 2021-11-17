const mongoose = require("mongoose")

const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nduyvu:Vu15112000@instagram-clone.agzar.mongodb.net/instagram?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    console.log("connected")
  } catch (error) {
    console.log("failed")
  }
}

module.exports = { connect }
