const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
	title: String,
	body: String,
	date: { type: Date, default: Date.now }
}); 

const Event = mongoose.model('event',EventSchema);

module.exports = Event;