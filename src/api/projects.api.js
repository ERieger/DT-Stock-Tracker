let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');

const Users = require('../models/user.model');
const Projects = require('../models/project.model');
const Classes = require('../models/class.model');
const Materials = require('../models/material.model');

router.post('/add', async (req, res) => {
    console.log(req.body, req.user)
    try {
        console.log('Adding document');
        await Projects.create(req.body)
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

module.exports = router;