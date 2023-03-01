const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 4500 || process.env.PORT //AUTOMATICALLY CHOOSES PORT WHEN HOST


const users = [{}];

app.use(cors()); //CORS IS USED FOR INTER COMMUNICATION BETWEEN URL
app.get("/", (req, res) => {
    res.send("HELL ITS WORKING");
})

const server = http.createServer(app); //SERVER CREATED

const io = socketIO(server); //CREATED A CURCIT/CONNECTION OF IO (SERVER IS PASSED)

io.on("connection", (socket) => { //WHEN CURCIT/CONNECTION OF IO IS ON THEN DO THIS
    console.log("New Connection");

    socket.on('joined', ({ user }) => {
        users[socket.id] = user; //THE ID IN SOCKET WILL GET SAVE INTO USER (EVERY SOCKET HAS DIFFERENT ID)
        console.log(`${user} has joined `);
        socket.broadcast.emit('userJoined', { user: "Admin", message: ` ${users[socket.id]} has joined` }); //BROADCAST MEANS "HAS JOINED" MESSAGE WILL BE SEND EXCEPT TO THE PERSON WHO HAS JOINED THE CHAT
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat, ${users[socket.id]} ` }) // EMIT ALSO MEANS THAT IF I HAVE LOGIN THEN ONLY I CAN SEE MY DATA
    })

    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id });
    })

    socket.on('disconnected', () => {
        console.log(`${users[socket.id]} has left the chat`);
    })
});


server.listen(port, () => {
    console.log(`Server Working on http://localhost:4500/`);
})