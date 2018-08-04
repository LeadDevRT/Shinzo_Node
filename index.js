const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const net = require('net');
const serverPort = 41234;
const secret = "tbDRldYRtJ";
var isLive = true;
// List of clients connected (= Unity Server)
var clients = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

net.createServer(function (socket) {
  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 
  // Put this new client in the list
  clients.push(socket);

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
  });

}).listen(serverPort);

  // Send a message to all clients
function broadcast(message) {
    clients.forEach(function (client) {

      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
}

// Endpoint to check if Buy & Collect is live
app.get('/is_live', function (req, res) {

  if (clients.length < 0) {
		res.status(200);
		res.send('System live');
  } else {
  	res.status(404);
	res.send('System offline');
  }

})

// Endpoint to send event (open or update) to Unity Server
app.get('/event_cell', function (req, res) {

  var index = req.param('index');
  var token = req.param('token');
  var action = req.param('action');  

  if (token == secret) {

	if (action != null) {
		res.status(200);
		res.send('Request sent');
		broadcast ('{"index":"'+index+'", "action":"' + action + '"}')

	} else {
		res.status(400);
		res.send('Bad request');
	}

  } else {
  	res.status(403);
	res.send('Bad token');
  }

})

app.listen(process.env.PORT || 5000, function () {
  console.log('App ready!')
})