var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var WebSocketServer = require('ws').Server
var http = require('http');

var count = 0;
var clients = {};

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
	response.writeHead(200, {'Content-Type': 'text/plain'});
	  response.write("Welcome to Node.js on OpenShift!\n\n");
	  response.end("Thanks for visiting us! \n");
});

server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: false
});
wss.on('connection', function(ws) {
  // Specific id for this client & increment count
  var id = count++;
  ws.send('you are client ' + id);
  // Store the connection method so we can loop through & contact all clients
  clients[id] = ws;
  console.log("New connection");
  // ON SEND
  ws.on('message', function(message) {
    console.log(message);
    broadcast((new Date()) + " client " + id + " > " + message);
  });
  // DISCONNECT
  ws.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + ' Client ' + id + ' disconnected.');
  });

  ws.send('Welcome!');
});

wss.broadcast = function broadcast(data) {
  for(var i in clients){
      // Send a message to the client with the message
      clients[i].send(data);
  }
};


console.log("Listening to " + ipaddress + ":" + port + "...");
