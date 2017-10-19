const express = require('express');
const router = express.Router();
const moment = require('moment');


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });


//mongoose db connection and promise.
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//database connection
const db = require('../database/connection.js');
db.connect().then( () => {
    console.log('db connection ok! go http://localhost:3000')
},
err => {
    console.log('error in db connection!')
});

//load all models  
const Event  = require('../database/models/events')


/* GET event by Month number(starts from 0) */
router.get('/month/:monthNo', function(req, res, next) {

  var year = moment().format('YYYY');
  const startOfMonth = moment([year, req.params.monthNo]).startOf('month').format('YYYY-MM-DD hh:mm');
  const endOfMonth   = moment([year, req.params.monthNo]).endOf('month').format('YYYY-MM-DD hh:mm');

  mongoose.model('events').find({"created" : {"$gte": startOfMonth,  "$lt":endOfMonth }} , function(err,events) {

    res.send(events);
  });  
});


/* GET events listing. */
router.get('/',function(req, res, next) {
    mongoose.model('events').find(function(err,events) {
    res.send(events);
    });  
});


/* GET event by eventId. */
router.get('/:eventId', function(req, res, next) {
    mongoose.model('events').findById(req.params.eventId, function(err,event) {
        // Handle the error using the Express error middleware
        if(err) {
          console.error(err.stack)
        }
        //if resourece not found, raise error.
        if(!event) {
          res.status(404).send({message: 'No resourece found'});
        }

        res.status(200).send(event);
    });  
});

/* Post event */
router.post('/', jsonParser, function(req, res, next) {
    'use strict';
    //set model info from request body.
    //@todo check with proper data type, lenght, date etc.
    if(!req.body.title || !req.body.body) {
        res.status(400).send({message: 'Bad request'});
    }   
    //initiate new Event model
    var newEvent = new Event();
    newEvent.title = req.body.title;
    newEvent.body  = req.body.body;
    newEvent.start = moment(req.body.start).format('YYYY-MM-DD');

    newEvent.save( function(err) {
        // Handle the error using the Express error middleware
        if(err) {
          console.error(err.stack)
        }

      //get all events to send server.
      const io = req.app.get('socketio');
      io.emit('ticket', req.body);

      res.send({message: 'Event created successfully.'});
    });
});

/* Update event by eventId*/
router.put('/:eventId', jsonParser, function(req, res, next) {
    'use strict'
    if(!req.params.eventId || !req.body.title || !req.body.body) {
        res.status(400).send({message: 'Bad request'});
    }   

    mongoose.model('events').findById(req.params.eventId, function(err,event) {
        // Handle the error using the Express error middleware
        if(err) {
            console.error(err.stack)
        }
       //if resourece not found, raise error.
       if(!event) {
          res.status(404).send({message: 'No resourece found'});
       }
      event.title = req.body.title;
      event.body = req.body.body;
      event.updated = moment().format('YYYY-MM-DD hh:mm');

      //save event
      event.save(function(err) {
          if(err) {
              res.send(err)
          }
          //broadcast update.
          const io = req.app.get('socketio');
          io.emit('ticket', req.body);
          res.send({message: event.title+' Successfully updated '+event.body})
      });
    });  
});

/* Delete event by eventId. */
router.delete('/:eventId', function(req, res, next) {
    'use strict' 
    let event_obj = req.params.eventId;
    mongoose.model('events').findByIdAndRemove(req.params.eventId, function(err) {
        // Handle the error using the Express error middleware
        if(err) {
            console.error(err.stack)
         }
        //broadcast update.
        const io = req.app.get('socketio');
        io.emit('ticket-delete', event_obj);

        res.send({message: 'Successfully deleted'})
    });  
});


module.exports = router;
