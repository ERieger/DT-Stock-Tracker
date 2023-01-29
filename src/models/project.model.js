const mongoose = require('mongoose');                                   // Module to interact with the database
const Schema = mongoose.Schema;

/* Piece format
const piece = {
    material: id,   //the code of the material used by this piece
    qty: Number,    //the number of these pieces to order
    dim: {
        l: Number,  //length of piece
        w: Number,  //width of the piece (only for type 0 material)
    },
}
*/

const Project = new Schema({
    owner: String,  //The ID of the account which owns this project
    name: String,   //The name of the project
    desc: String,   //A description of the project
    class: String,  //The class this project belongs to
    thumb: String,  //URL for the thumbnail image
    qty: Number,    //default 1, only for templated orders (which can only be created by admins)
    pieces: Object,  //Collection of pieces used by the project
    status: String, //incomplete, pending, ordered
});

module.exports = mongoose.model('Project', Project);