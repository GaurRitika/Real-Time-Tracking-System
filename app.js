const express = require('express');
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine" , "ejs");
app.use(express.static("public"));


io.on("connection" , function (socket){
  // yahan location aaye
  socket.on("send-location",  function(data){
    // wapis bhejo frontend peh
    io.emit("receive-location" , {id: socket.id , ...data});
  })  ;
  // now call karogi abh tum script.js peh
    console.log("connected");


    socket.on("disconnect" , function(){
io.emit("user-disconnected" , socket.id);
    })
});


app.get("/", function(req , res){
    res.render("index");
   // res.send("hey");
  
});

server.listen(3000);
