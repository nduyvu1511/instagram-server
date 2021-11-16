const express = require("express")
const router = express.Router()

const postController = require("../app/controllers/PostController")
const authMiddleware = require("../app/middlewares/authMiddleware")

router.get("/newfeed", authMiddleware, postController.getNewFeed)
router.patch("/:userId/like/:postId", postController.handleLikePostById)
router.patch("/:userId/unlike/:postId", postController.handleUnLikePostById)
router.get("/:id", postController.getPostDetail)
router.get("/user/:id", authMiddleware, postController.getPostByUserId)
router.delete("/:post_id", postController.deletePost)
router.post("/", postController.createPost)
router.get("/", postController.getAllPost)

module.exports = router
