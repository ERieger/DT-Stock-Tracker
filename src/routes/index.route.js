let express = require('express');
let router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');     // Handle page access to authenticated users

const Users = require('../models/user.model');
const Projects = require('../models/project.model');
const Classes = require('../models/class.model');
const Materials = require('../models/material.model');

const Summary = require('../api/packer.api.js');

const { default: mongoose } = require('mongoose');

// The dashboard (home) page
router.get('/', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {            // Homepage
    let userProjects = await Projects.find({ owner: req.user.id }); // Fetch the user's projects

    let newAccount = userProjects.len == 0 ? true : false;    // Is the account new (do they have any projects)

    // Send data to rendering engine (this page is server-side rendered)
    res.render('dashboard',
        {
            projects: userProjects,
            newUser: newAccount,
            user: req.user
        }
    );
});

// The project entry/editing page
router.get('/project', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    res.render('project',
        {
            user: req.user,
            classes: await Classes.find({})
        }
    );
});

router.get('/manage', async (req, res) => {
    console.log(req.query.id);

    if (typeof req.query.id == 'undefined') {
        console.log('Clean load.');
        let materials = await Materials.find({});
        let formattedMaterials = [];

        materials.forEach((material) => {
            formattedMaterials.push({
                type: material.type,
                name: material.name,
                code: material.id,
                length: material.dim.l,
                width: material.dim.w,
                thickness: material.dim.h,
                id: material._id
            });
        });

        res.render('manage', {
            materials: formattedMaterials,
            edit: {
                _id: undefined,
                type: undefined,
                id: undefined,
                name: undefined,
                price: undefined,
                dim: { r: undefined, l: undefined, w: undefined, h: undefined }
            }
        });
    } else {
        console.log('Edit:', req.query.id);
        let materials = await Materials.find({});
        let formattedMaterials = [];

        materials.forEach((material) => {
            formattedMaterials.push({
                type: material.type,
                name: material.name,
                code: material.id,
                length: material.dim.l,
                width: material.dim.w,
                thickness: material.dim.h,
                id: material._id
            });
        });

        res.render('manage', {
            materials: formattedMaterials,
            edit: await Materials.findOne({ _id: req.query.id })
        });
    }
});

router.get('/summary', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    let projectList = await Summary.collectPieces();
    let summary = await Summary.calcPrice(projectList);

    console.log(projectList);
    console.log(summary);

    res.render('summary',
        {
            user: req.user,
            summary: summary
        }
    );
});

router.get('/summaryFile', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    let workbook = await Summary.excelGen();

    res.setHeader("content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.attachment("summary.xlsx");
    workbook.xlsx.write(res).then(() => { res.end() });
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