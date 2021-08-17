const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Peticion = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    emitter: {type: String},
    user_to: {type: String}
},
{versionKey: false })

module.exports = new mongoose.model('peticiones', Peticion)