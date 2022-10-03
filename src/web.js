require("dotenv").config()
const mongoose = require("mongoose")

const PORT = process.env.PORT || 80

mongoose.connect(process.env.MONGODB_URI, () => {
    console.log(`Connected to ${process.env.DB}!`)
})

const express = require("express")
const app = express()

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")

const controller = require("./controllers/mainController")

app.get("/", controller.loadHome)

const userRoute = require("./routes/userRoute")
app.use("/", userRoute)

app.use("/avatars/", express.static(__dirname + "/public/avatars/"))

app.listen(PORT, () => {
    console.log(`App started on ${process.env.URL}`)
})