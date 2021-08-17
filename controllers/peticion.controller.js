const mongoose = require('mongoose')
const Peticion = require('../models/peticion')
const Users = require('../models/user')

const peticionController = {}

    peticionController.nuevaPeticion = async (req, res)=>{
        let user = await Users.findOne({username: req.body.user_to}).exec();

        let peticion = await Peticion.findOne({emitter: req.body.emitter, user_to: user._id}).exec()

        if (!peticion){
            let id = new mongoose.Types.ObjectId()

            let nuevaP = new Peticion({
                _id: id,
                emitter: req.body.emitter,
                user_to: user._id
            })

            nuevaP.save(
                (err)=>{
                    if(err){
                        res.send(JSON.stringify({error: err}))
                    }
                    else {
                        res.json({success: true})
                    }
                }
            )
        }
        else {
            res.send(JSON.stringify({error: 'ya hay una peticion así'}))
        }
    }

    peticionController.listar = async (req, res)=>{
        Peticion.find({user_to: req.body.user_to}).exec((err, items)=>{
            if (err){
                res.send(JSON.stringify({error: err}))
            }
            else {
                return res.status(200).json(items)
            }
        })
    }

    peticionController.respuesta = async (req, res)=>{

        if (req.body.respuesta == 'aceptar'){
            const newFriend = await Users.findOne({_id: req.body.peticionData.emitter}).exec()

            let nuevo = await Users.updateOne({_id: req.payload._id}, {$push: {'lista_amigos': newFriend._id}}).exec()

            if (nuevo){
                
                Users.updateOne({_id: newFriend._id}, {$push: {'lista_amigos': new mongoose.Types.ObjectId(req.payload._id)}}).exec((err, done)=>{
                    if (err){
                        return res.status(204).send(err)
                    }
                })
            }
        }

        Peticion.remove({emitter: req.body.peticionData.emitter, user_to: req.body.peticionData.user_to}).exec()
        
        
        res.json({success: true})
    }

module.exports = peticionController