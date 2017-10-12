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
require('../models/events');

/* GET events listing. */
router.get('/', function(req, res, next) {
   mongoose.model('events').find(function(err,events) {
   		res.send(events);
   });	
});

/* GET event by eventId. */
router.get('/:eventId', function(req, res, next) {
   mongoose.model('events').findById(req.params.eventId, function(err,events) {
   		res.send(events);
   });	
});

/* GET event by eventStartDate and endEventDate. */
router.get('/month/:monthNo', function(req, res, next) {

	var year = moment().format('YYYY');
	const startOfMonth = moment([year, req.params.monthNo]).startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth   = moment([year, req.params.monthNo]).endOf('month').format('YYYY-MM-DD hh:mm');
    //res.send(startOfMonth+' to '+endOfMonth);
    
    mongoose.model('events').find({"created" : {"$gte": startOfMonth,  "$lt":endOfMonth }} , function(err,events) {
   		res.send(events);
   });	
});


module.exports = router;
