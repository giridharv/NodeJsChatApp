var path = require('path')
var express= require('express')
var http =require('http')
var moment =require('moment')
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
    from:'Admin',
    text:'welcome to the chat app',
})
socket.on('createLocation',function (res) {
    io.emit('newLocation',{
        from:'Admin',
        url:'https://www.google.com/maps?q='+res.lat+','+res.lng,
        createdAt: moment.valueOf()
    })
})

socket.broadcast.emit('newMessage',{
    from:'Admin',
    text:'new user joined',
    createdAt: moment.valueOf()
})
socket.on('disconnect',function()
{
    console.log("Client disconnected")
})
socket.on('createMessage',function (email,callback) {
    console.log(email)
    io.emit('newMessage',{
        from:email.from,
        text:email.text,
        createdAt: moment.valueOf()
    })
    callback()
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

