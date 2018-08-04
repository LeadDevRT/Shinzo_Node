const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const WebSocket = require('ws');
const serverPort = 41234;
const secret = "tbDRldYRtJ";
var isLive = true;
// List of clients connected (= Unity Server)
var clients = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Creating WebSocket server
const wss = new WebSocket.Server({
  port: serverPort,
});

wss.on('connection', function connection(ws) {
	clients.push (ws);
	console.log ("Client connected");
});

// Send a message to all clients
function broadcast(message) {
	console.log ("Client broadcasting");

	wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
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