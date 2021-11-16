const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")

class PostController {
  async getAllPost(req, res) {
    try {
      const posts = await Post.find({}).lean()
      const postIds = posts.map((post) => post._id)
      const comments = await Comment.find({ post_id: { $in: postIds } }).lean()

      posts.forEach((post) => {
        post.comments = 0
        comments.forEach((comment) => {
          if (post._id.equals(comment.post_id)) {
            post.comments++
          }
        })
      })
      res.json(posts)
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async getNewFeed(req, res) {
    const { page } = req.query
    const { _id: id } = res.locals
    try {
      const currentUser = await User.findById(id).lean()
      // Check current user has following id
      // Get all user by current id and following id
      const users = await User.find({
        $or: [
          { _id: { $in: currentUser.following_ids } },
          { _id: currentUser._id },
        ],
      }).lean()

      // Get id of all users
      const allId = users.map((user) => user._id)

      // get post by all user id
      const posts = await Post.find({ user_id: { $in: allId } })
        .sort({ createdAt: -1 })
        .lean()

      // get post id
      const postId = posts.map((post) => post._id)

      // get comments by post id
      const comments = await Comment.find({
        post_id: { $in: postId },
      }).lean()

      posts.forEach((post) => {
        post.comments = 0
        users.forEach((user) => {
          if (user._id.equals(post.user_id)) {
            post.user_name = user.user_name
            post.avatar = user.avatar
          }
        })
        comments.forEach((comment) => {
          if (post._id.equals(comment.post_id)) {
            post.comments++
          }
        })
      })

      const postSlice = posts.slice(page * 6 - 6, page * 6 - 1)

      return res.json(postSlice)
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async getPostByUserId(req, res) {
    try {
      const posts = await Post.find({ user_id: req.params.id })
        .sort({ createdAt: -1 })
        .lean()
      const postIds = posts.map((post) => post._id)

      const comments = await Comment.find({ post_id: { $in: postIds } }).lean()

      posts.forEach((post) => {
        post.comments = 0
        comments.forEach((comment) => {
          if (post._id.equals(comment.post_id)) {
            post.comments++
          }
        })
      })

      const user = await User.findById(req.params.id).lean()

      res.json({ info: user, posts })
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async getPostDetail(req, res) {
    try {
      const { id } = req.params
      const post = await Post.findOne({ _id: id }).lean()
      if (post) {
        const user = await User.findById(post.user_id).lean()

        // get comments by user id
        const comments = await Comment.find({ post_id: post._id })
          .sort({ createdAt: -1 })
          .lean()
        // get list user id of comment
        const userIdBycomments = comments.map((comment) => comment.user_id)
        // get user by list user comment
        const userComments = await User.find({
          _id: { $in: userIdBycomments },
        }).lean()

        comments?.length > 0 &&
          comments.forEach((comment) => {
            userComments.forEach((user) => {
              if (user._id.equals(comment.user_id)) {
                comment.user_comment_avatar = user.avatar
                comment.user_comment_name = user.user_name
              }
            })
          })
        const postData = {
          post: { ...post, avatar: user.avatar, user_name: user.user_name },
          comments: [...comments],
        }
        return res.json(postData)
      }
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async handleLikePostById(req, res) {
    const { postId, userId } = req.params
    try {
      const post = await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } })
      const user = await User.findByIdAndUpdate(userId, {
        $addToSet: { liked_post_id: postId },
      })
      return res.json({
        post: {
          _id: post.id,
          likes: post.likes + 1,
        },
        user: {
          _id: user.id,
          liked_post_id: [...user.liked_post_id, postId],
        },
      })
    } catch (error) {
      return res.status(400).send("error")
    }
  }

  async handleUnLikePostById(req, res) {
    const { postId, userId } = req.params
    try {
      const post = await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } })
      const user = await User.findByIdAndUpdate(userId, {
        $pull: { liked_post_id: postId },
      })
      const newLikedPostId = user.liked_post_id.filter(
        (item) => item !== postId
      )
      return res.json({
        post: {
          _id: post.id,
          likes: post.likes - 1,
        },
        user: {
          _id: user.id,
          liked_post_id: newLikedPostId,
        },
      })
    } catch (error) {
      return res.status(400).send("error")
    }
  }
  async createPost(req, res) {
    try {
      const { body: formData } = req
      const post = new Post(req.body)
      await post.save()
      const newPost = {
        ...formData,
        _id: post._id,
        likes: 0,
        comments: 0,
      }
      return res.json(newPost)
    } catch (error) {
      return res.status(400).send("error")
    }
  }

  async deletePost(req, res) {
    const { post_id } = req.params
    try {
      await Post.deleteOne({ _id: post_id })
      return res.json({ post_id })
    } catch (error) {
      return res.status(400).send("error")
    }
  }
}

module.exports = new PostController()
