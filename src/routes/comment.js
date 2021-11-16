const express = require("express")
const router = express.Router()
const commentController = require("../app/controllers/CommentController")

router.get("/:postId", commentController.getCommentsByPostId)
router.post("/:userId", commentController.postComment)
router.get("/", commentController.getComment)
router.delete("/:id", commentController.deleteComment)
router.patch("/:id", commentController.editComment)

module.exports = router
