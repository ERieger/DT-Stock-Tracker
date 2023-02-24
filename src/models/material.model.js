const mongoose = require('mongoose');                                   // Module to interact with the database
const Schema = mongoose.Schema;

const Dimensions = new Schema({
    r: Number,
    l: Number
});

const Material = new Schema({
    type: Number,
    id: String,
    name: String,
    price: Number,
    dim: Object
});

module.exports = mongoose.model('Material', Material);