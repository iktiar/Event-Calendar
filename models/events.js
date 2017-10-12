const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventsSchema = new Schema({
	title: String,
	body: String,
	event_date: { type: Date, default: Date.now },
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now }

}); 

const Event = mongoose.model('events',EventsSchema);

module.exports = Event;