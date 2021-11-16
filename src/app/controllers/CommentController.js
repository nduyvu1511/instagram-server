const Comment = require("../models/Comment")
const User = require("../models/User")

class CommentController {
  async postComment(req, res) {
    const { userId } = req.params
    console.log(req.body)
    try {
      const comment = new Comment(req.body)
      const user = await User.findOne({ _id: userId })
      await comment.save()
      const commentData = {
        _id: comment._id,
        post_id: comment.post_id,
        title: comment.title,
        user_id: comment.user_id,
        user_comment_avatar: user.avatar,
        user_name: user.user_name,
      }
      return res.json(commentData)
    } catch (err) {
      return res.status(400).send("error")
    }
  }
  async getComment(req, res) {
    try {
      const comments = await Comment.find({})
      return res.json(comments)
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async getCommentsByPostId(req, res) {
    try {
      const comments = await Comment.find({ post_id: postId })
      return res.json(comments)
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async deleteComment(req, res) {
    const { id: commentId } = req.params
    try {
      const data = await Comment.deleteOne({ _id: commentId })
      return res.json({ commentId })
    } catch (err) {
      return res.status(400).send("error")
    }
  }
  async editComment(req, res) {
    try {
      const { id } = req.params
      const { body: comment } = req
      await Comment.findOneAndUpdate({ _id: id }, comment)
      return res.json(comment)
    } catch (err) {
      return res.status(400).send("error")
    }
  }
}

module.exports = new CommentController()
