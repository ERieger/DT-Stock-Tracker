const mongoose = require('mongoose');                                   // Module to interact with the database
const Schema = mongoose.Schema;

const User = new Schema({
    name: String
});

module.exports = mongoose.model('User', User);