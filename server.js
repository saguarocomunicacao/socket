var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Configuração do socket.io com CORS e transporte forçado para WebSocket
var io = require('socket.io')(server, {
  cors: {
    origin: "*",  // ou especifique o domínio correto
    methods: ["GET", "POST"]
  },
  transports: ['websocket']  // Força o uso de WebSocket
});

app.use(express.static(__dirname + '/node_modules'));

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
  console.log(__dirname + '/node_modules');
});

// Middleware para configurar CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Rota principal
app.get('/', function(req, res, next) {  
  res.sendFile(__dirname + '/index.html');
});

// Gerenciando conexões do socket.io
io.on('connection', function(client) {
  console.log('Client connected:', client.id);

  // Evento de recebimento de mensagens
  client.on('messages', function(data) {
    console.log(`${data.broad} -> ${data.user}: ${data.msg}`);
    client.emit(data.broad, data);
    client.broadcast.emit(data.broad, data);
  });

  // Evento de desconexão
  client.on('disconnect', (reason) => {
    console.log(`Client ${client.id} disconnected: ${reason}`);
  });
});
