let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const packer = require('guillotine-packer').packer;

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

let summaryGen = {
    calcPrice: async function (pieceByClass) {
        let materials = await Materials.find({});
    
        let total = 0;
    
        Object.keys(pieceByClass).forEach((entry) => {
            let classTotal = 0;
    
            Object.keys(pieceByClass[entry]).forEach((piece) => {
                let pieceCost = 0;
    
                let material = materials.find(x => x.id == piece);
    
                /* This is where we calculate the cost */
                if (material.type == 0) {
                    let pieceList = pieceByClass[entry][piece];
    
                    let result = pack(pieceList, material)[0].pop();
    
                    pieceByClass[entry][piece].bins = result.bin;
                    pieceCost = material.price * result.bin;
                } else {
                    pieceCost = material.price * (pieceByClass[entry][piece].l / 1000); //convert to metres
                }
    
                pieceByClass[entry][piece].type = material.type;
                pieceByClass[entry][piece].unitPrice = material.price.toFixed(2);
                pieceByClass[entry][piece].netPrice = pieceCost.toFixed(2);
                classTotal += pieceCost;
            });
    
            pieceByClass[entry].price = classTotal.toFixed(2);
            total += classTotal;
        });
    
        pieceByClass.price = total.toFixed(2);
    
        return(pieceByClass);
    },
    collectPieces: async function () {
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
                        width: parseInt(piece.dim.w),
                        height: parseInt(piece.dim.l),
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
}

module.exports = summaryGen;