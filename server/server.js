var path = require('path')
var express= require('express')
var http =require('http')
var socketIO = require('socket.io')
var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var publicPath = path.join(__dirname,'../public')
var port = process.env.PORT || 3000
app.use(express.static(publicPath))

io.on('connection',function (socket) {
    console.log("New client connected")
socket.emit('newMessage',{
    from:'admin',
    text:'welcome to the chat app',
})
socket.broadcast.emit('newMessage',{
    from:'admin',
    text:'new user joined',
    createdAt:new Date().getTime()
})
socket.on('disconnect',function()
{
    console.log("Client disconnected")
})
socket.on('createMessage',function (email) {
    console.log(email)
    io.emit('newMessage',{
        from:email.from,
        text:email.text,
        createdAt: new Date().getTime()
    })
    // socket.broadcast.emit('newMessage',
    //     {
    //         from:email.from,
    //         text:email.text,
    //         createdAt: new Date().getTime()
    //     })
    })
})

server.listen(port,function () {
    console.log("Server up on " + port )
})

