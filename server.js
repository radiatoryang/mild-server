// uncomment these for OpenShift support, and edit "server.listen(port," >>> "server.listen(port, ipaddress""
//var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
//var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// Heroku doesn't actually use this port, it'll randomly assign a port
var port      = process.env.PORT || 3000;

var WebSocketServer = require('ws').Server
var http = require('http');
var auth = require('basic-auth');

// server vars to track currently connected clients
var count = 0;
var clients = {};

// very minimal basic authentication features, so complete randos cannot connect to your server
// - you should change the username and password
// - you could bake the username and password into your client, but that's technically insecure
var useAuthentication = true;
var authUsername = 'serverUsername';
var authPassword = 'serverSecretPassword';

// http handshake that begins the websocket connection
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    // if you care, make sure to use https:// + SSL + wss://, or else you're sending your password in plain unencrypted text
    var credentials = auth(request)
    // authentication is enabled, and username or password were wrong
    if (useAuthentication && ( !credentials || credentials.name !== authUsername || credentials.pass !== authPassword ) ) {
      console.log((new Date()) + ' auth denied for ' + credentials.name + "/" + credentials.pass);
      response.statusCode = 401
      response.setHeader('WWW-Authenticate', 'Basic realm="server"')
      response.end('Access denied')
    } else { // no authentication, or username and password were correct
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.write("Welcome to this Mild server!");
      response.end("Thanks for playing! \n");
    }
});

server.listen( port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

// websockets stuff goes below here
wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: false
});

// main websocket function
wss.on('connection', function(ws) {
  // Specific id for this client & increment count
  var id = count++;
  // tell everyone about the new player joining
  broadcast(ws, "newjoin^" + id.toString() );
   // store new client ID in the socket object
  ws.clientID = id;
  // store new socket in list of sockets
  clients[id] = ws;
  // send list of all current clients to you, INCLUDING you -- you are the last one on this list
  ws.send('welcome^' + getClientList() );

  console.log("New connection... current clients: " + getClientList() );

  // ON SEND MESSAGE, when a client sends a message to the server...
  ws.on('message', function(message) {
  //  console.log((new Date()) + ' client ' + id + ' > ' +  message);
    broadcast(ws, message); // ... then relay that message to everyone else
  });

  // DISCONNECT, deletes client object and notifies other clients that this client left
  ws.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + ' Client ' + id + ' disconnected.');
    broadcast(ws, 'leave^' + id);
  });

});

// make a list of all currently connected clients, by number
function getClientList() {
  var clientList = "";
  for(var i in clients){
      clientList += clients[i].clientID + ",";
  }
  return clientList;
}

// Send a message to all clients, except the sender
function broadcast(sender, data) {
  for(var i in clients){
      if ( sender != i )
        clients[i].send(data);
  }
};
