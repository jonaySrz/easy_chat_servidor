const Users = require('../models/user')
const mongoose = require('mongoose');
const user = require('../models/user');

userController = {};

userController.listaGente = (req, res) =>{
    Users.find().exec((err, users)=>{
        if (err){
            return console.log(err);
        }

        if (!users){
            return res.status(204).send({error: 'no se han encontrado registros'})
        }

        res.json(users)
    })
}

userController.addFriend = async (req, res)=>{

    const newFriend = await Users.findOne({username: req.body.username}).exec()
    
    let nuevo = await Users.updateOne({_id: req.payload._id}, {$push: {'lista_amigos': newFriend._id}}).exec()

    if (nuevo){
        
        Users.updateOne({_id: newFriend._id}, {$push: {'lista_amigos': new mongoose.Types.ObjectId(req.payload._id)}}).exec((err, done)=>{
            if (err){
                return res.status(204).send(err)
            }
    
            res.json({success: true})
        })
    }
}

userController.listaUno = (req, res)=>{

    Users.findOne({_id: req.body._id}).exec((err, users)=>{
        if (err){
            return console.log(err);
        }

        if (!users){
            return res.status(204).send({error: 'no se ha encontrado el usuario'})
        }

        res.json(users)
    })
}

userController.deleteFriend = (req, res)=>{
    let friend = new mongoose.Types.ObjectId(req.body.friend_id);

    let deleted = Users.updateOne({_id: req.payload._id}, {$pull: {'lista_amigos': friend}}).exec()

    if (deleted){
        Users.updateOne({_id: friend}, {$pull: {'lista_amigos': new mongoose.Types.ObjectId(req.payload._id)}}).exec(
            (err, done)=>{
                if (err){
                    return res.status(204).send(err)
                }
        
                res.json({success: true})
            }
        )
    }
}

userController.editarPerfil = async (req, res)=>{
    let actualUser = await Users.findOne({_id: req.payload._id}).exec()
    let compUser = await Users.find({username: req.body.username}).exec()
    let compEmail = await Users.find({email: req.body.email}).exec()

    if(compUser.length > 1 || (compUser.length == 1 && actualUser.username !== req.body.username)){
        return res.json({error: 'usuario repetido'})
    }
    if(compEmail.length > 1 || (compUser.length == 1 && actualUser.email !== req.body.email)){
        return res.json({error: 'email repetido'})
    }

    Users.updateOne({_id: req.body._id},{$set: {password: req.body.password, username: req.body.username, email: req.body.email}}).exec(
        (err)=>{
            if (err){
                return res.status(204).send(err)
            }
    
            res.json({success: true})
        }
    )
}


userController.borrarPerfil = async (req, res)=>{
    let user = await Users.findOne({_id: req.payload._id}).exec()

    user.lista_amigos.forEach(element => {
        Users.updateOne({_id: element}, {$pull: {'lista_amigos': new mongoose.Types.ObjectId(req.payload._id)}}).exec()
    });

    Users.remove({_id: req.payload._id}).exec((err)=>{
        if (err){
            return res.status(204).send(err)
        }

        res.json({success: true})
    })
}

module.exports = userController;