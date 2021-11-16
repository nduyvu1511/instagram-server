const express = require("express")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const morgan = require("morgan")
const route = require("./routes")
const cors = require("cors")
const db = require("./config/index")
const app = express()
const port = process.env.PORT || 8080
const path = require("path")

app.use(express.static(path.join(__dirname, "../public")))

app.use(cookieParser())

app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(express.json())

db.connect()

// Middleware

// HTTP logger
app.use(morgan("combined"))

const corsConfig = {
  origin: true,
  credentials: true,
}

app.use(cors(corsConfig))
app.options("*", cors(corsConfig))

route(app)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
