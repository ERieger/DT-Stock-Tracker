let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');

const Users = require('../models/user.model');
const Projects = require('../models/project.model');
const Classes = require('../models/class.model');
const Materials = require('../models/material.model');

router.post('/add', async (req, res) => {
    let project = req.body;
    project['owner'] = req.user.id;
    
    console.log(project, req.user)
    
    try {
        console.log('Adding document');
        await Projects.create(project)
            .then(async (doc) => {
                try {
                    await Users.updateOne({ _id: req.user.id }, { $push: { projects: doc._id } });
                } catch (err) {
                    res.send(`Error: ${err}`);
                }
                console.log(doc._id);
                res.send(doc._id);
            });
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

router.post('/update', async (req, res) => {
    let project = req.body;

    try {
        await Projects.updateOne({_id: project.id}, { $set: project.project })
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

router.post('/fetch', async (req, res) => {
    try {
        let project = await Projects.findById(req.body.id);

        res.send(project);
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

router.post('/orderone', async (req, res) => {
    try {
        await Projects.updateOne({_id: req.body.id }, { $set: { status: 'pending' }});

        res.send('Project successfully ordered')
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

router.post('/order', async (req, res) => {
    try {
        await Projects.updateMany({ 'status': 'pending'}, { $set: { 'status': 'ordered'}});
        
        res.send('Projects successfully ordered');
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

module.exports = router;