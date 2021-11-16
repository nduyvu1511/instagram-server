const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const CLIENT_ID = `218340770121-6jjg4paqbo1koqptr09lmu4dbkr3fi1v.apps.googleusercontent.com`
const client = new OAuth2Client(CLIENT_ID)

class UserController {
  async getSearchUser(req, res, next) {
    try {
      const users = await User.find({}).lean()
      const newUsers = users.map((user) => ({
        _id: user._id,
        name: user.name,
        user_name: user.user_name,
        avatar: user.avatar,
      }))
      return res.json(newUsers)
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async getUser(req, res, next) {
    try {
      const users = await User.find({}).lean()
      return res.json(users)
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async getRecommendUser(req, res, next) {
    const { _id } = res.locals
    if (_id) {
      try {
        const user = await User.findById(_id)
        const { following_ids } = user
        const recommendUser = await User.find({
          _id: { $nin: [...following_ids, user._id.toString()] },
        })
          .sort({ createdAt: -1 })
          .lean()
        const newRecommendUser = recommendUser.map((user) => {
          return {
            _id: user._id,
            name: user.name,
            user_name: user.user_name,
            avatar: user.avatar,
          }
        })
        return res.json(newRecommendUser)
      } catch (err) {
        return res.status(400).send("error")
      }
    } else {
      return res.status(400).send("id not found")
    }
  }

  async getLoggedUser(req, res, next) {
    try {
      const { _id } = res.locals
      const user = await User.findById(_id).lean()
      return res.json(user)
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async getUserDetail(req, res, next) {
    const { id } = req.params
    try {
      const user = await User.findById(id).lean()
      return res.json(user)
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async register(req, res, next) {
    const { email, password: bodyPassword } = req.body
    try {
      const existingUser = await User.findOne({ email })

      if (existingUser) {
        return res
          .status(404)
          .send({ message: `Một tài khoản khác đang sử dụng ${email}.` })
      }

      const password = await bcrypt.hash(bodyPassword, 10)
      const user = new User({ ...req.body, password })
      await user.save()
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET
      )
      return res.json({ token })
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async login(req, res, next) {
    // Check if user login with google account
    if (req.body.tokenId) {
      async function verify() {
        const ticket = await client.verifyIdToken({
          idToken: req.body.tokenId,
          audience: CLIENT_ID,
        })
        const payload = ticket.getPayload()
        const { email, name, given_name } = payload
        const isExistingEmail = await User.findOne({ email })
        if (!isExistingEmail) {
          const user = new User({
            email,
            user_name: name.replace(/ /g, ""),
            name: given_name,
            password: "Test123456@",
          })
          await user.save()
        }
      }
      verify()
        .then(() => {
          User.findOne({ email: req.body.email }).then((user) => {
            const token = jwt.sign(
              {
                _id: user._id,
              },
              process.env.JWT_SECRET
            )
            return res.json({ token })
          })
        })
        .catch(() => res.status(400).send({ message: "error" }))
      return
    }

    // Normal login
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email }).lean()
      if (!user) {
        return res.status(404).send({
          message:
            "Email bạn đã nhập không thuộc về tài khoản. Vui lòng kiểm tra email của bạn và thử lại.",
        })
      }

      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_SECRET
        )

        return res.json({ token })
      } else {
        return res.status(404).send({
          message:
            "Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại mật khẩu.",
        })
      }
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async changePassword(req, res, next) {
    const { newPassword, currentPassword } = req.body
    const { userId } = req.params
    try {
      const user = await User.findById(userId)
      if (user) {
        if (!(await bcrypt.compare(currentPassword, user.password))) {
          return res.status(400).send({
            message: "Bạn đã không nhập đúng mật khẩu cũ. Vui lòng nhập lại.",
          })
        }

        if (await bcrypt.compare(newPassword, user.password)) {
          return res.status(400).send({
            message: "Tạo mật khẩu mới khác với mật khẩu hiện tại của bạn.",
          })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await User.findByIdAndUpdate(userId, {
          $set: { password: hashedPassword },
        })

        return res.status(200).send({ message: "Đã thay đổi mật khẩu." })
      } else {
        return res.status(400).send({ message: "not found userId" })
      }
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async handleFollowUser(req, res, next) {
    try {
      const { currentId, followerId } = req.params
      await User.findOneAndUpdate(
        { _id: currentId },
        {
          $addToSet: { following_ids: followerId },
        }
      )
      await User.findOneAndUpdate(
        { _id: followerId },
        {
          $addToSet: { is_followed_by_ids: currentId },
        }
      )
      return res.json({ currentId, followerId })
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async handleUnFollowUser(req, res) {
    try {
      const { currentId, unfollowerId } = req.params
      await User.findOneAndUpdate(
        { _id: currentId },
        {
          $pull: { following_ids: unfollowerId },
        }
      )
      await User.findOneAndUpdate(
        { _id: unfollowerId },
        {
          $pull: { is_followed_by_ids: currentId },
        }
      )
      return res.json({ currentId, unfollowerId })
    } catch (err) {
      return res.status(400).send("error")
    }
  }

  async editProfile(req, res, next) {
    try {
      const { body: userEdit } = req
      const { id } = req.params
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: userEdit },
        { new: true }
      )
      return res.json(user)
    } catch (err) {
      return res.status(400).send({ message: "can not find id" })
    }
  }
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params
      const user = await User.findOneAndDelete({ _id: id })
      return res.status(200).send({ message: "delete user successfully" })
    } catch (err) {
      return res.status(400).send({ message: "can not find id" })
    }
  }
}

module.exports = new UserController()
