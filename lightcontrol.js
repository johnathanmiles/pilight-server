var gpio = require('rpi-gpio');
var async = require('async');

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});

// GPIO Pins
var MOD_MODE_SELECT = 18
var MOD_ENABLER = 22
var D0 = 11
var D1 = 15
var D2 = 16
var D3 = 13

// Control Codes
// D3 D2 D1 D0
// 1  0  1  1   ALL ON
// 0  0  1  1   ALL OFF
// 1  1  1  1   SOCKET 1 ON
// 0  1  1  1   SOCKET 1 OFF
// 1  1  1  0   SOCKET 2 ON
// 0  1  1  0   SOCKET 2 OFF
// 1  1  0  1   SOCKET 3 ON
// 0  1  0  1   SOCKET 3 OFF
// 1  1  0  0   SOCKET 4 ON
// 0  1  0  0   SOCKET 4 OFF


function setup(onOff, switchCallback) {
// Setup the pins (can be in parallel)
	async.parallel([
	    function(callback) {
    	    gpio.setup(MOD_MODE_SELECT, gpio.DIR_OUT, callback)
    	},
    	function(callback) {
	        gpio.setup(MOD_ENABLER, gpio.DIR_OUT, callback)
   	 	},
    	function(callback) {
        	gpio.setup(D0, gpio.DIR_OUT, callback)
    	},
    	function(callback) {
        	gpio.setup(D1, gpio.DIR_OUT, callback)
    	},
	    function(callback) {
    	    gpio.setup(D2, gpio.DIR_OUT, callback)
	    },
    	function(callback) {
	        gpio.setup(D3, gpio.DIR_OUT, callback)
    	},
	], function(err, results) {
    	
    	async.series([
    		function(callback) {    			
    			delayedWrite(MOD_ENABLER, 0, callback); // Turn the modulator off
    		},
    		function(callback) {
    			delayedWrite(MOD_MODE_SELECT, 0, callback); // Select ASK mode signal (for OOK)
    		},
    		function(callback) {
            	gpio.write(D0, 0, callback); // Set all pins to false (no delay)
        	},
        	function(callback) {
            	gpio.write(D1, 0, callback);
        	},
        	function(callback) {
            	gpio.write(D2, 0, callback);
        	},
        	function(callback) {
            	gpio.write(D3, 0, callback);
        	}
        ], function(err, results) {
        	switchCallback(onOff); // Now write out to the pins	
        });
	});	
}

// onOff is true or false
exports.switchSocket1 = function(onOff) {
	setup(onOff, function(onOff) {
		console.log('switching socket 1');
		async.series([
	        function(callback) {
            	delayedWrite(D0, 1, callback);
        	},
    	    function(callback) {
	            delayedWrite(D1, 1, callback);
        	},
    	    function(callback) {
	            delayedWrite(D2, 1, callback);
        	},
    	    function(callback) {
	           	delayedWrite(D3, onOff, callback);
        	},
    	    function(callback) {
	           	delayedWrite(MOD_ENABLER, 1, callback);
        	},
        	function(callback) {
	           	delayedWrite(MOD_ENABLER, 0, callback);
        	}
    	], function(err, results) {
    	    console.log('Writes complete, pause then unexport pins');
        	setTimeout(function() {
            	gpio.destroy(function() {
                	console.log('Closed pins');
            	});
        	}, 500);
    	});
	});
};

function delayedWrite(pin, value, callback) {
    setTimeout(function() {
        gpio.write(pin, value, callback);
    }, 500);
}