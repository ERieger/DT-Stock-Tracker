const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');     // Handle page access to authenticated users
const MongoStore = require('connect-mongo');                    // Store session data in mongo
const { v4: uuidv4 } = require('uuid');                         // Module to generate uuids
const path = require('path');                                   // Interact with file paths

const config = require("./config/main.config.json")

const dotenv = require('dotenv');                               // Require env library
dotenv.config({ path: `${__dirname}/config/.env` });            // Set env location

// Initialise app
const app = express();                      // Define app
app.set('views', __dirname + '/views');     // Views directory
app.set('view engine', 'pug');              // Set view engine
app.get('/status', (req, res) => { res.status(200).end(); });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

const authRouter = require('./routes/auth.route');
const indexRouter = require('./routes/index.route');
const materialsApi = require('./api/material.api');
const projectsApi = require('./api/projects.api');
const packerApi = require('./api/packer.api');

// Connect to database - load values form environment variables
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`, {
    dbName: process.env.MONGO_DATABASE,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Users = require('./models/user.model');
const Projects = require('./models/project.model');
const Classes = require('./models/class.model');
const Materials = require('./models/material.model');

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
    saveUninitialized: false,
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
app.use('/static', express.static(path.join(__dirname, '../public/static')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/api/materials', materialsApi);
app.use('/api/projects', projectsApi);

// Start server listening on selected port
app.listen(config.network.port, () => {
    console.log(`App listening on port ${config.network.port}!`)
});