const express = require('express')
const app = express()
var server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static('public'))
var users={}

io.on('connection',socket=>{
    socket.on('new-user',user=>{
        users[socket.id]=user
        console.log(users)
        socket.emit("userJoin",users)
        socket.broadcast.emit('user-connected',user)
    })

    socket.on('send-message',message=>{
        socket.broadcast.emit('chat-message',{message:message,name:users[socket.id]})
    })

    socket.on('user-disconnect',()=>{
        socket.disconnect()
        if(typeof users[socket.id] != "undefined"){
            socket.broadcast.emit('user-disconnected',users[socket.id])
            delete users[socket.id]
        }
    })

    socket.on('disconnect',()=>{
        if(users[socket.id] != "undefined"){
            socket.broadcast.emit("user-disconnected",users[socket.id])
            delete users[socket.id]
        }
    })
})

server.listen(3001,()=>{console.log('server Connected')})