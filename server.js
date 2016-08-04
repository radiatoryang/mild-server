// uncomment these for OpenShift support, and edit "server.listen(port," >>> "server.listen(ipaddress, port,""
//var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
//var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// Heroku doesn't actually use this port, it'll randomly assign a port
var port      = process.env.PORT || 3000;

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

server.listen( port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: false
});

wss.on('connection', function(ws) {
  // Specific id for this client & increment count
  var id = count++;
  // tell everyone about the new player, but NOT the new player yet
  broadcast(ws, "newjoin^" + id.toString() );
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
    broadcast(ws, message);
  });

  // DISCONNECT
  ws.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + ' Client ' + id + ' disconnected.');
    broadcast(ws, 'leave^' + id);
  });

});

function getClientList() {
  var clientList = "";
  for(var i in clients){
      // make a list of all currently connected clients
      clientList += clients[i].clientID + ",";
  }
  return clientList;
}

function broadcast(sender, data) {
  for(var i in clients){
      // Send a message to the client with the message, but not to the sender
      if ( sender != i )
        clients[i].send(data);
  }
};
