var express = require('express');
var lights = require('./lights.js');
var schedule = require('node-schedule');
var lightcontrol = require('./lightcontrol.js');
var winston = require('winston');

var app = express();
app.get('/lighton', lights.turnOn);
app.get('/lightoff', lights.turnOff);

//app.get('/lights', lights.findAll);
//app.get('/lights/:id', lights.findById);
//app.post('lights', lights.addLight);
//app.put('lights', lights.updateLight);
//app.delete('lights', lights.deleteLight);

winston.add(winston.transports.File, { filename: 'pilight.log' });
app.listen(3000);

winston.info('Pilight Server running on port 3000...');

var ruleOn = new schedule.RecurrenceRule();
ruleOn.hour = 19;
ruleOn.minute = 0;

var jobOn = schedule.scheduleJob(ruleOn, function(){
  lightcontrol.switchSocket1(1);
});

var ruleOff = new schedule.RecurrenceRule();
ruleOff.hour = 22;
ruleOff.minute = 30;

var jobOff = schedule.scheduleJob(ruleOff, function(){
  lightcontrol.switchSocket1(0);
});

winston.info('Light Schedule Configured');
