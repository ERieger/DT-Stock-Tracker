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

router.post('/add', async (req, res) => {
    console.log(req.body);

    try {
        await Materials.create(req.body);
        res.send('success.');
    } catch (err) {
        res.send(err);
    }
});

router.post('/delete', async (req, res) => {
    console.log(req.body.material);

    try {
        await Materials.deleteOne({ _id: req.body.material })
        res.send('success.');
    } catch (err) {
        res.send(err);
    }
});

router.post('/edit', async (req, res) => {
    console.log(req.body);
    try {
        await Materials.updateOne({ _id: req.body.id }, req.body.material);
        res.send('success.');
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;