const express = require("express")
const router = express.Router()
const multer = require("multer")
const uploadController = require("../app/controllers/UploadController")

const imageUploader = multer({ dest: "public/images" })
const avatarUploader = multer({ dest: "public/avatars" })

router.post(
  "/image",
  imageUploader.single("imageName"),
  uploadController.uploadImage
)

router.delete("/image/:image", uploadController.deleteImage)

router.delete("/avatar/:avatar/:id", uploadController.deleteAvatar)

router.post(
  "/avatar/:id",
  avatarUploader.single("avatarName"),
  uploadController.uploadAvatar
)

module.exports = router
