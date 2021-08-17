const Users = require('../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

loginController = {};

loginController.login = async (req, res)=>{
    const user = await Users.findOne({username: [req.body.username]}).exec()

    if(!user){
        return res.status(401).send('El usuario no existe')
    }
    if (user.password !== req.body.password){
        return res.status(401).send('La contraseña no es correcta')
    }

    const token = jwt.sign({_id: user._id}, 'secretpass')

    return res.status(200).json({token, xyz: user._id})
}

loginController.signup = async (req, res)=>{
    const userName = await Users.findOne({username: [req.body.username]}).exec()
    const userEmail = await Users.findOne({email: [req.body.email]}).exec()

    if (userName){
        return res.status(401).send('El usuario ya existe')
    }
    if (userEmail){
        return res.status(401).send('El email ya existe')
    }

    let newUser = new Users(req.body)
    
    newUser._id = new mongoose.Types.ObjectId();
    newUser.lista_amigos = []

    newUser.save(
        (err)=>{
            if (err){
                res.send(JSON.stringify({error: err}))
            }
            else {
                const token = jwt.sign({_id: newUser._id}, 'secretpass')

                return res.status(200).json({token, xyz: newUser._id})
            }
        }
    )
}

module.exports = loginController