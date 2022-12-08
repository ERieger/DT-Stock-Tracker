const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');     // Handle page access to authenticated users
const MongoStore = require('connect-mongo');                    // Store session data in mongo
const { v4: uuidv4 } = require('uuid');                         // Module to generate uuids

const config = require("./config/main.config.json")

const dotenv = require('dotenv');                               // Require env library
dotenv.config({ path: `${__dirname}/config/.env` });            // Set env location

// Initialise app
const app = express();                      // Define app
app.set('views', __dirname + '/views');     // Views directory
app.set('view engine', 'pug');              // Set view engine
app.get('/status', (req, res) => { res.status(200).end(); });

const authRouter = require('./routes/auth.route');

// Connect to database - load values form environment variables
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`, {
    dbName: process.env.MONGO_DATABASE,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = require('./models/user.model');

// Initialise session
app.use(session({
    genid: (req) => {
        let uuid = uuidv4();
        return uuid; // TODO: This needs to be validated to check it doesn't exist
    },
    secret: process.env.COOKIE_KEY,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: process.env.MONGO_DATABASE
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000, secure: false },    // 1 hour, allow http
}));

app.use(passport.initialize());                         // Initialise passport
app.use(passport.session());                            // Initialise session

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

// Routing
app.get('/', (req, res) => {            // Homepage
    res.render('index');
});

app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.render('dashboard')
})

// Logout users
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

app.get('/authtest', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.send(`Hello ${req.user.name}. Your session ID is ${req.sessionID} 
     and your session expires in ${req.session.cookie.maxAge} 
     milliseconds.<br><br>
     <a href="/logout">Log Out</a><br><br>`);
});

app.use('/', authRouter)

// Start server listening on selected port
app.listen(config.network.port, () => {
    console.log(`App listening on port ${config.network.port}!`)
});