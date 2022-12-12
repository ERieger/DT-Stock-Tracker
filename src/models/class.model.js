const mongoose = require('mongoose');                                   // Module to interact with the database
const Schema = mongoose.Schema;

const Class = new Schema({
    name: String,
    teacher: String
});

module.exports = mongoose.model('Class', Class);