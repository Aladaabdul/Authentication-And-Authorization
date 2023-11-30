const express = require("express");
const passport = require("passport") //Authentication
const connectEnsureLogin = require("connect-ensure-login") //Authorization Middleware
const bodyParser = require("body-parser")
const userModel = require("./models/users")
const session = require("express-session") // Session middleware
require("dotenv").config()
const bookRouter = require("./routes/books")
const {connectTomongo} = require("./db");
const { serialize } = require("mongodb");
const PORT = 8000

const app = express()

// Connecting To Database
connectTomongo()

// Configure App to use session
// Session is a way to store data on the server between request
// We are storing the authenticated user for the period of the session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 + 60 + 1000}
}))

app.use(bodyParser.urlencoded({ extended: false}));
app.use(passport.initialize())
app.use(passport.session());

passport.use(userModel.createStrategy())// User Usermodel to create the strategy

// serialize and deserialize the user object to and from the session
passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())

app.set("views", "views");
app.set("view engine", 'ejs')

//Secure the /books route
app.use('/books', connectEnsureLogin.ensureLoggedIn(), bookRouter);

// Render the home page
app.get('/', (req, res) => {
    res.render('index')
})

// Render the login page
app.get("/login", (req, res) => {
    res.render('login')
})

// Render the signup page
app.get('/signup', (req, res) => {
    res.render('signup')
})

//Handles the signup request for new users
app.post('/signup', (req, res) => {
    const user = req.body;
    userModel.register(new userModel({ username: user.username}), user.password, (err, user) => {
        if (err) {
            console.log(err);
            res.status(400).send(err)
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/books')
            });
        }
    })
})

// Handle login request for existing users
// app.post('/login', passport.authenticate('local', {failureRedirect:'/login'}, (req, res) => {
//     res.redirect('/books')
// }))

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/books'
}));


app.post('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }
        res.redirect('/');
    });
});


app.listen(PORT, () => {
    console.log(`http:\\localhost:${PORT}`)
})