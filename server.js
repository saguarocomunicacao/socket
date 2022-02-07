// app.js
var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io')(server);

/*io.origins((origin, callback) => {
    console.log(origin);

    if (origin !== '*') {
        return callback('origin not allowed', false);
    }
    callback(null, true);
});*/

app.use(express.static(__dirname + '/node_modules'));

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
  console.log(__dirname + '/node_modules');
});

app.use(express.static(__dirname + '/node_modules'));  

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var whitelist = ['http://www.ingressoshow.com', 'https://www.ingressoshow.com'];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.get('/', cors(corsOptionsDelegate), function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(client) {
    console.log('Client connected...');

	client.on('messages', function(data) {
		console.log(""+data.broad+" -> "+data.user+": "+data.msg);
		client.emit(""+data.broad+"", data);
		client.broadcast.emit(""+data.broad+"",data);
	});
});
