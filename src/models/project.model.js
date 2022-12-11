const mongoose = require('mongoose');                                   // Module to interact with the database
const Schema = mongoose.Schema;

const Project = new Schema({
    name: String,
    desc: String,
    thumb: String,
    template: Boolean,
    pieces: Array,
    complete: Boolean
});

module.exports = mongoose.model('Project', Project);