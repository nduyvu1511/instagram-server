const userRouter = require("./user.js")
const postRouter = require("./post.js")
const commentRouter = require("./comment.js")
const uploadRouter = require("./upload.js")

const route = (app) => {
  app.use("/users", userRouter)
  app.use("/posts", postRouter)
  app.use("/comments", commentRouter)
  app.use("/upload", uploadRouter)
}

module.exports = route
