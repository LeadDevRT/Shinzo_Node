const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const net = require('net');
const serverAddr = "81.250.174.157";
const serverPort = 41234;
const secret = "tbDRldYRtJ";
var isLive = true;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// TODO : add a way to check if Buy&Collect is live or not
app.get('/is_live', function (req, res) {

  if (isLive) {
		res.status(200);
		res.send('System live');
  } else {
  	res.status(404);
	res.send('System offline');
  }

})

// Endpoint to send event to Buy&Collect Unity Server
app.get('/event_cell', function (req, res) {

  // Getting params
  var index = req.param('index');
  var token = req.param('token');
  var action = req.param('action');  

  // If secret is good then proceed.
  if (token == secret) {

	if (action != null) {
		res.status(200);
		res.send('Request sent');
		// Create TCP client and connect to Unity Server
		var client = new net.Socket();
		client.connect(serverPort, serverAddr, function() {
			client.write('{"index":"'+index+'", "action":"' + action + '"}');
			client.destroy();
		});
		client.on('error', function(err){
			console.log("Error: "+err.message);
		})
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