const express = require('express');

const app = express();

const events = require('../routes/events');
const http = require('http').Server(app);
const io = require('socket.io')(http);

//for static files
app.use('/', express.static('../app/'));
app.use('/bower_components', express.static('../bower_components/'));
//socket io set
app.set('socketio', io); 

//router  
app.use('/events', events);  

//listen at port
http.listen(3000, function () {
	'use strict';
});
