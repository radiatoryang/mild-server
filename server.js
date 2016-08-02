var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var WebSocketServer = require('ws').Server
var http = require('http');

var playerID = 0;

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
	response.writeHead(200, {'Content-Type': 'text/plain'});
	  response.write("Welcome to the simple Unity game server");
	  response.end("Thanks for visiting us! \n");
});

server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: false
});

wss.on('connection', function(client) {
  playerID++;
  var clientName = "player"+playerID;
  console.log("New connection: " + clientName);
  client.send("New connection: " + clientName);

  client.on('message', function(data) {
    var message = clientName + '> ' + data.toString();
    broadcast(client, message);
  });

});

wss.broadcast = function broadcast(sender, data) {
  wss.clients.forEach(function each(client) {
//    if ( sender == client )
//      return;
    client.send(data);
  });
};

console.log("Listening to " + ipaddress + ":" + port + "...");
