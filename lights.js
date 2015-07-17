var lightcontrol = require('./lightcontrol.js');
var winston = require('winston');

exports.turnOn = function(req, res) {

  winston.info('Turning on');
  lightcontrol.switchSocket1(1);
  res.send("On");
};

exports.turnOff = function(req, res) {
  
  winston.info('Turning off');
  lightcontrol.switchSocket1(0);
  res.send("Off");
};
