const express = require('express')
const app = express()
const dgram = require('dgram');
const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');

app.post('/event_cell', function (req, res) {
 res.send('Ok');
 //client.send(message, 41234, '127.0.0.1', (err) => {
 //console.log(err);
 //});
})
app.get('/event_cell', function (req, res) {
 res.send('Ok');
 //client.send(message, 41234, '127.0.0.1', (err) => {
 //console.log(err);
 //});

})

app.listen(process.env.PORT || 5000, function () {
  console.log('App ready!')
})