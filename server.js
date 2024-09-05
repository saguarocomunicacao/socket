// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);

//var io = require('socket.io')(server);
var io = require('socket.io')(server, {
  cors: {
    origin: "*",  // ou especifique o domínio correto
    methods: ["GET", "POST"]
  }
});

app.use(express.static(__dirname + '/node_modules'));

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
  console.log(__dirname + '/node_modules');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log('Client connected...');

	client.on('messages', function(data) {
		console.log(""+data.broad+" -> "+data.user+": "+data.msg);
		client.emit(""+data.broad+"", data);
		client.broadcast.emit(""+data.broad+"",data);
	});
});
