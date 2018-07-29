const express = require('express')
var bodyParser = require('body-parser')
const app = express()
// const dgram = require('dgram');
// const client = dgram.createSocket('udp4');
const net = require('net');
const serverAddr = "92.184.101.225";
// const serverAddr = "127.0.0.1";
const serverPort = 41234;
const secret = "tbDRldYRtJ";
var isLive = true;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/event_cell', function (req, res) {
 res.status(404);
 res.send('Please use get method');
})


app.get('/is_live', function (req, res) {

  if (isLive) {
		res.status(200);
		res.send('System live');
  } else {
  	res.status(404);
	res.send('System offline');
  }

})


app.get('/event_cell', function (req, res) {

  var index = req.param('index');
  var token = req.param('token');
  var action = req.param('action');  

  if (token == secret) {

	if (action != null) {
		res.status(200);
		res.send('Request sent');
		// var message = Buffer.from('{"index":"'+index+'", "action":"' + action + '"}');
		// console.log ('{"index":"'+index+'", "action":"' + action + '"}');
		// client.send(message, serverPort, serverAddr, (err) => {
		// 	console.log(err);
		// });
		var client = new net.Socket();
		client.connect(serverPort, serverAddr, function() {
			console.log('Connected');
			client.write('{"index":"'+index+'", "action":"' + action + '"}');
			client.destroy();
		});
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