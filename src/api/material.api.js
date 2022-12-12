let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');

const Users = require('../models/user.model');
const Projects = require('../models/project.model');
const Classes = require('../models/class.model');
const Materials = require('../models/material.model');

router.get('/list', async (req, res) => {
    let materials = await Materials.find({});
    // let materials = undefined;
    res.send(materials);
});

module.exports = router;