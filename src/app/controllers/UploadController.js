const fs = require("fs")
const url = require("url")
const User = require("../models/User")

class UploadController {
  async uploadImage(req, res, next) {
    const processedFile = req.file || {}
    let orgName = processedFile.originalname || ""
    orgName = orgName.trim().replace(/ /g, "-")
    const fullPathInServ = processedFile.path
    const newFullPath = `${fullPathInServ}-${orgName}`
    fs.renameSync(fullPathInServ, newFullPath)
    res.send({
      status: true,
      message: "file uploaded",
      fileNameInServer: url.format(newFullPath).substring(7),
    })
  }

  async uploadAvatar(req, res, next) {
    const processedFile = req.file || {}
    let orgName = processedFile.originalname || ""
    orgName = orgName.trim().replace(/ /g, "-")
    const fullPathInServ = processedFile.path
    const newFullPath = `${fullPathInServ}-${orgName}`
    fs.renameSync(fullPathInServ, newFullPath)
    const avatarUrl = `http://localhost:8080/${url
      .format(newFullPath)
      .substring(7)}`
    await User.findOneAndUpdate({ _id: req.params.id }, { avatar: avatarUrl })
    res.send({
      status: true,
      message: "file uploaded",
      fileNameInServer: avatarUrl,
    })
  }
  async deleteImage(req, res) {
    try {
      fs.unlinkSync(`public/images/${req.params.image}`)

      res.status(201).send({ message: "Image deleted" })
    } catch (e) {
      res.status(400).send({
        message: "Error deleting image!",
        error: e.toString(),
        req: req.body,
      })
    }
  }
  async deleteAvatar(req, res) {
    try {
      fs.unlinkSync(`public/avatars/${req.params.avatar}`)
      await User.findOneAndUpdate({ _id: req.params.id }, { avatar: "" })
      res.status(201).send({ message: "Image deleted" })
    } catch (e) {
      res.status(400).send({
        message: "Error deleting image!",
        error: e.toString(),
        req: req.body,
      })
    }
  }
}

module.exports = new UploadController()
