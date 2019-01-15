var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);
const faker = require('faker');

var clients = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  
  clients.push(socket.id);
  
  const nickname = faker.Internet.userName();

  console.log(`user ${nickname} connected`);

  socket.emit('nickname', {nickname: nickname});

  socket.on('is typing', function(data){
    socket.broadcast.emit('typing', {nickname: data.nickname});
  });

  socket.on('not typing', function(data){
    socket.broadcast.emit('typing', null);
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});