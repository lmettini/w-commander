
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , ejs = require('ejs')
  , path = require('path');

/*var app = express();

var io = require('socket.io').listen(app);
*/
var app     = express(), 
  server  = require('http').createServer(app), 
  io      = require('socket.io').listen(server);

//Configuración para que ejs cambie los simbolos por unos mas copados de escribir
ejs.open = '{{';
ejs.close = '}}';

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/commander', function(req, res){
  res.render('commander.ejs', {});
});

app.get('/soldier', function(req, res){
  res.render('soldier.ejs', {});
});
app.get('/waiting', function(req, res){
  res.render('waiting.ejs',{});
});


io.sockets.on('connection', function (socket) {
  socket.emit('go-to', '/waiting');

  socket.on('go-here', function (url) {
    io.sockets.emit('go-to', url);
  });
});


server.listen(app.get('port'), function(){
  console.log('listening in http://localhost:'+app.get('port'));
});
