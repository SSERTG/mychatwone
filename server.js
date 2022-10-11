const express = require('express')
const socket = require('socket.io')(http,{cors:{origin:"*"}});

const app = express()
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("server");
})

app.use(express.static('public'))

const io = socket(server)

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('chat', data => {
        io.sockets.emit('chat', data)
    })

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data)
    })
})
