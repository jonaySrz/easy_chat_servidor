const mongoose = require('mongoose')
const Conversation = require('../models/mensaje')

const converController = {}


converController.nuevoMsg = (req, res)=>{
    let msg = new Conversation(req.body)

    msg._id = new mongoose.Types.ObjectId();

    msg.save(
        (err)=>{
            if (err){
                res.send(JSON.stringify({error: err}))
            }
            else {
                return res.status(200).json({success: true})
            }
        }
    )
}

converController.listarMsg = (req, res)=>{

    Conversation.find({$or: [{emitter: req.body.user},{user_to: req.body.user}]}).sort({createdAt: 1}).exec(
        (err, data)=>{
            if (err){
                res.json({success: false})
            }
            else {
                res.status(200).json(data)
            }
        }
    )
}

converController.borrarConver = async (req, res)=>{

    await req.body.forEach(async (element) => {
        await Conversation.deleteOne({emitter: element.emitter, mensaje: element.mensaje, user_to: element.user_to}).exec(
            (err)=>{
                if (err){
                    console.log(err);
                }
            }
        )
    });

    let response = await req.body.forEach(async (element) => {
        await Conversation.find({emitter: element.emitter, mensaje: element.mensaje, createdAt: element.createdAt}).exec()
    });

    if (response !== undefined){
        res.json({success: false})
    }
    else {
        res.json({success: true})
    }
}

module.exports = converController;