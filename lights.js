var lightcontrol = require('./lightcontrol.js');

exports.turnOn = function(req, res) {
  console.log('Turning On');
  lightcontrol.switchSocket1(1);
  res.send("On");
};

exports.turnOff = function(req, res) {
  console.log('Turning Off');
  lightcontrol.switchSocket1(0);
  res.send("Off");
};
