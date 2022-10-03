const User = require("../../data/models/userModel")

const bcrypt = require("bcrypt")

const mailer = require("nodemailer")
const { log } = require("console")

const securePass = async (pass) => {
    const passw = await bcrypt.hash(pass, 10)
    return passw
}

const sendVerMail = async (user) => {

    const transport = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'olex7imatix.org@gmail.com',
            pass: "ocuadrupmakqvkea"
        }
    })

    const mailOpt = {
        from: "Olex7iMatix.org - CatAccount",
        to: user.email,
        subject: "Verify you'r CatAccount",
        html: `<h1>Hi ${user.username},</h1><p> It looks like you are trying to Verify you'r CatAccount!</p><h3>Click <a href="http://localhost/verify?id=${user._id}">here</a> to verify your account!</h3>`
    }

    transport.sendMail(mailOpt, (err, info) => {

        if (err) console.error(err)
        else console.log(info)

    })

}

const loadRegister = async (req, res) => {

    res.render("register.ejs")

}

const createUser = async (req, res) => {

    if (!(req.body.password === req.body.confpassword)) {
        res.render("register.ejs", {message: "Passwords must be this same!"})
        return
    }

    const spass = await securePass(req.body.password)

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        displayAvatarURL: req.file.filename,
        password: spass,
    })

    console.log(user)

    const userData = await User.create(user)

    if(userData) {
        sendVerMail(userData)
        res.redirect("/login")
    } else {
        res.render('register', {message: "Your registration has been failed!"})
    }

}

const verifyMail = async (req, res) => {

    if (!await User.findOne({_id: req.query.id})) {
        res.render("verify", {message: "This id is incorrect!"})
    }

    await User.updateOne({_id:req.query.id}, { $set: { is_verified: true }})

    res.render("verify", {message: "Successfully verifyied your email!"})

}

const loadLogin = async (req, res) => {

    res.render('login')

}

const verifyLogin = async (req, res) => {

    const email = req.body.email
    const pass = req.body.password

    log(email + " | " + pass)

    let u = await User.findOne({ email })

    console.log(u);

    if (u === null) {
        
        res.render('login', {message: `Username or password is incorrect!`})

    } else {

        login(u, pass, res)

    }

}

const login = async (u, pass, res) => {

    const match = await bcrypt.compare(pass, u.password)

    if (match) {

        if (u.is_verified === false) {

            res.render('login', {message: `User must be verified!`})

        } else {

            res.redirect('/')

        }

    } else {

        res.render('login', {message: `Username or password is incorrect!`})

    }

}

module.exports = {
    loadRegister,
    createUser,
    verifyMail,
    loadLogin,
    verifyLogin
}