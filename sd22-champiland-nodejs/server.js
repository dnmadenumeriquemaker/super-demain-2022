
var five = require("johnny-five");
const express = require('express');
const app = express();
app.use(express.static('public'));

const server = app.listen(8001);

const io = require('socket.io')(server);



let leds = [];

var board = new five.Board({
  port: '/dev/tty.usbmodem113201'
});

let lastLedPin = null;

board.on("ready", function () {
  console.log('board ready');

  for (let i = 14; i <= 40 ; i++) {
    leds[i] = new five.Led(i);
  }

  io.on('connection', (socket) => {
    console.log('Page connected: ' + socket.id);

    socket.on('setNextButton', function (data) {
      console.log('setNextButton', data);

      for (let i = 14; i <= 40 ; i++) {
        leds[i].stop().off();
      }

      leds[data.ledPin].blink(100);
    });

    socket.on('endGame', function () {
      console.log('endGame');

      for (let i = 14; i <= 40 ; i++) {
        leds[i].stop().off();
      }
    });

    socket.on('waitGame', function () {
      console.log('waitGame');

      for (let i = 14; i <= 40 ; i++) {
        leds[i].stop().off();
      }
      
      leds[data.ledPin].blink(100);
    });

  });


});
