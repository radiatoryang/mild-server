//var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
//var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var port      = process.env.PORT || 3000;
var ipaddress = process.env.IP || "127.0.0.1";

var WebSocketServer = require('ws').Server
var http = require('http');

var count = 0;
var clients = {};

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
	response.writeHead(200, {'Content-Type': 'text/plain'});
	  response.write("Welcome to this Mild server!");
	  response.end("Thanks for visiting us! \n");
});

server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 3000');
});

wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: false
});
wss.on('connection', function(ws) {
  // Specific id for this client & increment count
  var id = count++;
  // tell everyone about the new player, but NOT the new player yet
  broadcast('join^' + id);
   // store new client ID
  ws.clientID = id;
  // store new socket in list
  clients[id] = ws;
  // send list of all current clients to you, INCLUDING you
  ws.send('welcome^' + getClientList() );

  console.log("New connection... current clients: " + getClientList() );

  // ON SEND MESSAGE
  ws.on('message', function(message) {
  //  console.log((new Date()) + ' client ' + id + ' > ' +  message);
    broadcast(message);
  });

  // DISCONNECT
  ws.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + ' Client ' + id + ' disconnected.');
    broadcast('leave^' + id);
  });


});

function getClientList() {
  var clientList = "";
  for(var i in clients){
      // Send a message to the client with the message
      clientList += clients[i].clientID + ",";
  }
  return clientList;
}

function broadcast(data) {
  for(var i in clients){
      // Send a message to the client with the message
      clients[i].send(data);
  }
};


console.log("Listening to port " + port + "...");
