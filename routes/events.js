var express = require('express');
var router = express.Router();
var moment = require('moment');

//mongoose db connection and promise.
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/* @todo move db connection in proper place.*/
// using promises
mongoose.connect('mongodb://localhost/events_test', { 
    useMongoClient: true,
  }).then( () => { 
       console.log('db connection ok..')
      /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
    },
      err => { console.warn('Warning', error);
    /** handle initial connection error */ 
  }
);

//load all models  
const Event  = require('../models/events')

/* GET events listing. */
router.get('/', function(req, res, next) {
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
router.post('/', function(req, res, next) {
        //set model info from request body.
        //@todo check with proper data type, lenght, date etc.
        if(!req.body.title || !req.body.body && !req.body.created) {
         	res.status(400).send({message: 'Bad request'});
        }	
        //initiate new Event model
        var newEvent = new Event();
        newEvent.title = req.body.title;
        newEvent.body  = req.body.body;
        newEvent.created = req.body.created;

        newEvent.save( function(err) {
            // Handle the error using the Express error middleware
	        if(err) {
	        	console.error(err.stack)
 	        }

	        res.send({message: 'Event created successfully.'});
        });
});

/* Update event by eventId*/
router.put('/:eventId', function(req, res, next) {
   mongoose.model('events').findById(req.params.eventId, function(err,event) {
   	    // Handle the error using the Express error middleware
        if(err) {
        	console.error(err.stack)
        }

        //if resourece not found, raise error.
        if(!event) {
        	res.status(404).send({message: 'No resourece found'});
        }
       
   	    //set and update model
        if(req.body.title) {
        	event.title = req.body.title;
        }
        if(req.body.body) {
        	event.body = req.body.body;
        }	
        event.updated = moment().format('YYYY-MM-DD hh:mm');
        
        //save event
        event.save(function(err) {
        	if(err) {
        		res.send(err)
        	}
            res.send({message: 'Successfully updated'})
        });
   });	
});

/* Delete event by eventId. */
router.delete('/:eventId', function(req, res, next) {
   mongoose.model('events').findByIdAndRemove(req.params.eventId, function(err) {
   	    // Handle the error using the Express error middleware
        if(err) {
        	console.error(err.stack)
        }
        
   	    res.send({message: 'Successfully deleted'})
   });	
});


/* GET event by Month number(starts from 0) */
router.get('/month/:monthNo', function(req, res, next) {

	var year = moment().format('YYYY');
	const startOfMonth = moment([year, req.params.monthNo]).startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth   = moment([year, req.params.monthNo]).endOf('month').format('YYYY-MM-DD hh:mm');
    
    mongoose.model('events').find({"created" : {"$gte": startOfMonth,  "$lt":endOfMonth }} , function(err,events) {
   		
   		res.send(events);
   });	
});


module.exports = router;
