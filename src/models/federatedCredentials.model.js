const mongoose = require('mongoose');                                   // Module to interact with the database
const Schema = mongoose.Schema;

const FederatedCredentials = new Schema({
    provider: String,
    subject: String,
    userId: String,
});

module.exports = mongoose.model('FederatedCredentials', FederatedCredentials);