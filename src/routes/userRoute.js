const express = require("express")
const route = express()

const parser = require("body-parser")

route.use(parser.json())
route.use(parser.urlencoded({extended: true}))

const multer = require("multer")

const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/avatars/'))
    },
    filename: (req, file, cb) => {
        const name = req.body.username+'-'+file.originalname
        cb(null, name)
    }
})

const upload = multer({ storage })

route.set("views", __dirname + "/../views/users")

const userController = require("../controllers/userController")

route.get('/register', userController.loadRegister)

route.post('/register', upload.single('avatar'), userController.createUser)

route.get("/verify", userController.verifyMail)

route.get("/login", userController.loadLogin)

route.post("/login", userController.verifyLogin)


module.exports = route