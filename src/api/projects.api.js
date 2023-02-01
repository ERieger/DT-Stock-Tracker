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
                res.send('Project successfully added.')
            });
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