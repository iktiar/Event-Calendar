const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventsSchema = new Schema({
	title: String,
	body: String,
	start: { type: Date, default: Date.now },
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now },
	stick: {type: Boolean, default:true}

}); 

const Event = mongoose.model('events',EventsSchema);

module.exports = Event;