const express = require('express')
const app = express()
const dgram = require('dgram');
const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');


app.get('/', function (req, res) {
  res.send('Hello World!')
client.send(message, 41234, '127.0.0.1', (err) => {
console.log(err);
  //client.close();
});

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})