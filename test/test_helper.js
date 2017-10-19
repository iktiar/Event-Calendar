
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //https://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise

// using promises
mongoose.connect('mongodb://localhost/events_test', { 
	useMongoClient: true,
} ).then( () => { 
	console.log('connection ok..')
	/** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
},
err => { console.warn('Warning', error);
/** handle initial connection error */ 
}
);
