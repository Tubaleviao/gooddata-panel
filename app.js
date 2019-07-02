var express = require('express'),
app = express(),
http = require('http'),
https = require('https'),
port = 443,
bodyParser = require('body-parser'),
session = require('express-session'),
routes = require('./routes'),
session_secret = 'nosecrethereisusedsoyeah',
code = require('./codes.js'),
options = code.options,
server = https.createServer(options, app),
io = require('socket.io')(server);

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  console.log(`Worker ${process.pid} started`);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(__dirname + '/public'));
  app.use(session({ secret: session_secret, saveUninitialized: true, resave: false }));
  app.set('view engine', 'ejs');
  
  app.get('/painel', routes.painel);
  app.get('*', function(req, res){res.send('Nothing here.');});
  
  io.of('/painel').on('connection', code.painel);
  server.listen(port, function(){console.log("Server running at the port %d", port);});
}

