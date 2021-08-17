const express = require('express')
const path = require('path')
const app = express();
const routing = require('./router')
const morgan = require('morgan')
const cors = require('cors')
const database = require('./database')
const Conver = require('./models/mensaje')
const mongoose = require('mongoose')

//settings
app.set('port', process.env.PORT || 3000)

//database connection
database.conexion();

//static files
app.use(express.static(path.join(__dirname + 'public')))

//middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.use(morgan('dev'))
app.use(cors())

//router
app.use('/', routing)

//error handling
app.use((req, res, next)=>{
    res.status(404).send(JSON.stringify({error: '404'}));
});

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send(JSON.stringify({error: '500'}));
});

//starting server
const server = app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'));
})

//web sockets
const socketIO = require('socket.io')
const io = socketIO(server, {
    cors: {
        origin: "*"
    }
})

users = []

io.on('connection', (socket)=>{

    socket.on('clear_data', (username)=>{
        users.forEach(element => {
            if (element.username == username){
                let i = users.indexOf(element)
                users.splice(i, 1)
            }
        });
    })

    socket.on('starting_chat', (username)=>{
        users.push({username, id: socket.id})
    })


    socket.on('chat:mensaje', (data)=>{
        users.forEach(element => {
            
            if (element.username == data.destination){
                io.to(element.id).emit('chat:mensaje', {mensaje: data.mensaje, emitter: data.user, createdAt: new Date()})
            }
        });
    })

    socket.on('chat:typing', (data)=>{
        users.forEach(element => {
            if (element.username == data.destination){
                io.to(element.id).emit('chat:typing', {typing: data.typing, emitter: data.user})
            }
        })
    })
})