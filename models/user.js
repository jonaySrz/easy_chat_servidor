const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Users = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    email: {type: String},
    password: {type: String},
    username: {type: String},
    lista_amigos: []
},
{ versionKey: false })

module.exports = new mongoose.model('usuarios', Users)