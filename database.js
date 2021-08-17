const mongoose = require('mongoose');

let database = {}

database.conexion = ()=>{
    mongoose.connect('mongodb://localhost/chat', { useUnifiedTopology: true, useNewUrlParser: true })
    const db = mongoose.connection

    db.on('error', function(err){
        console.log('mongoDB connection error: ', err)
    })

    db.once('open', function(){
        console.log('mongoDB is connected')
    })
}

module.exports = database;