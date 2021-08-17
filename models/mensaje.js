const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Conversation = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    emitter: {type: String},
    user_to: {type: String},
    mensaje: {type: String}
},
{ timestamps: { timestamps: true },
versionKey: false })

module.exports = new mongoose.model('conver', Conversation)