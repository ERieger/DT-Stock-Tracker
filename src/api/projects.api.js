let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');

const Users = require('../models/user.model');
const Projects = require('../models/project.model');
const Classes = require('../models/class.model');
const Materials = require('../models/material.model');

router.post('/add', async (req, res) => {
    console.log(req.body)
    try {
        console.log('Adding document');
        await Projects.create(req.body);
        res.send('Project successfully added.')
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

module.exports = router;