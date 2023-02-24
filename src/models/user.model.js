const mongoose = require('mongoose');                                   // Module to interact with the database
const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    admin: Boolean,
    projects: Array
});

module.exports = mongoose.model('User', User);