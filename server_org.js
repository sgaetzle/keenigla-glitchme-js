var express = require("express");
var app = express(); 
var serv = require("http").Server(app);
var io = require("socket.io")(serv);
app.use(express.static('public'));

/*app.get('/', function(request, response) {
  response.sendFile(__dirname + '/src/pages/index.hbs');
});*/

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Static files
app.use(express.static("client"));