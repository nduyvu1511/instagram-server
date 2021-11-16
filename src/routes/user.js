const express = require("express")
const router = express.Router()

const userController = require("../app/controllers/UserController")
const authMiddleware = require("../app/middlewares/authMiddleware")

router.patch(
  "/:currentId/unfollow/:unfollowerId",
  userController.handleUnFollowUser
)
router.get("/search", userController.getSearchUser)
router.patch("/:currentId/follow/:followerId", userController.handleFollowUser)
router.get("/recommend", authMiddleware, userController.getRecommendUser)
router.get("/logged", authMiddleware, userController.getLoggedUser)
router.get("/:id", userController.getUserDetail)
router.post("/login", userController.login)
router.patch("/:userId/change-password", userController.changePassword)
router.post("/register", userController.register)
router.patch("/:id/edit", userController.editProfile)
router.get("/", authMiddleware, userController.getUser)
router.delete("/:id", userController.getUser)

module.exports = router
