let express = require('express');
let router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');     // Handle page access to authenticated users

const Users = require('../models/user.model');
const Projects = require('../models/project.model');
const Classes = require('../models/class.model');

router.get('/', (req, res) => {            // Homepage
    res.render('index');
});

router.get('/authtest', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.send(`Hello ${req.user.name}. Your session ID is ${req.sessionID} 
     and your session expires in ${req.session.cookie.maxAge} 
     milliseconds.<br><br>
     <a href="/logout">Log Out</a><br><br>`);
});

router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    let user = await Users.findOne({ _id: req.user.id });
    let pageData = {
        projects: [],
        completed: []
    }

    if (user.projects.length >= 1) { // User has projects
        for (let i = 0; i < user.projects.length; i++) {
            let doc = await Projects.findOne({ _id: user.projects[i] }, 'name desc thumb complete');
            if (doc.complete == true) {
                pageData.completed.push(doc);
            } else {
                pageData.projects.push(doc);
            }
        }
    } else { // User has no projects
        pageData.projects = "No Projects.";
        pageData.completed = "No Projects."
    }

    if (pageData.projects.length == 0) {
        pageData.projects = "No Projects.";
    }

    if (pageData.completed.length == 0) {
        pageData.completed = "No Projects.";
    }

    console.log(pageData)

    res.render('student-dashboard', pageData)
});

router.get('/form', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    let pageData = {
        classes: []
    }
    let classGroups = await Classes.find({}, 'name teacher');

    for (let i = 0; i < classGroups.length; i++) {
        pageData.classes.push({
            name: `${classGroups[i].name} - ${classGroups[i].teacher}`,
            id: classGroups[i]._id.toString()
        });
    }

    res.render('form', pageData);
});

module.exports = router;