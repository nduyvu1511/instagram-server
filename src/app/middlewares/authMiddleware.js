const jwt = require("jsonwebtoken")

const authMiddleware = async (req, res, next) => {
  const token = req.cookies
  try {
    const { _id } = jwt.verify(token.userId, process.env.JWT_SECRET)
    if (_id) {
      res.locals._id = _id
      next()
    } else {
      res.status(404).send({ message: "user nor found" })
    }
  } catch (err) {
    res.status(400).send("token not found")
  }
}

module.exports = authMiddleware
