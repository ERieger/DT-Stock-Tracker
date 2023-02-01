let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const packer = require('guillotine-packer');

const Users = require('../models/user.model');
const Projects = require('../models/project.model');
const Classes = require('../models/class.model');
const Materials = require('../models/material.model');
const e = require('express');


function pack(pieces, material) {
    let result = packer({
        binHeight: material.dim.l,
        binWidth: material.dim.w,
        items: pieces,
    });

    return result;
}

async function calculate_price(pieceByClass) {
    let materials = await Materials.find({});

    let total = 0;

    console.log(pieceByClass);
    console.log(materials);

    Object.keys(pieceByClass).forEach((entry) => {
        let classTotal = 0;

        console.log(entry);
        Object.keys(pieceByClass[entry]).forEach((piece) => {
            let pieceCost = 0;

            console.log(piece);
            /* This is where we calculate the cost */

            classTotal += pieceCost;
        });
        total += classTotal;
    });
}

async function collect_pieces() {
    let projects = await Projects.find({ 'status': 'pending' });

    let collected = new Object;

    projects.forEach((project) => {
        if (collected[project.class] == undefined) collected[project.class] = new Object;

        project.pieces.forEach((piece) => {
            if (collected[project.class][piece.material] == undefined) {
                if (piece.type == 0) {
                    collected[project.class][piece.material] = new Array;
                } else {
                    collected[project.class][piece.material] = new Object;
                    collected[project.class][piece.material]['l'] = 0;
                }
            }
            if (piece.type == 0) {
                /* Put entries into the right format for the packer */
                let entry = {
                    width: piece.dim.w,
                    height: piece.dim.l,
                };

                for(var i=0;i<piece.qty;i++) collected[project.class][piece.material].push(entry);
            }
            else {
                collected[project.class][piece.material].l += (piece.dim.l * piece.qty);
            } 
        });
    });

    return collected;
}

router.get('/gen', async function (req, res) {
    let list = await collect_pieces();

    calculate_price(list);

    res.send('beans');
});

module.exports = router;