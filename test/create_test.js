const assert = require('assert');
const Event  = require('../server/database/models/events')

describe('Creating records with today\'s date', () => {
	it('saves a event', () => {
		const event = new Event({ 
			title: 'demo event test', 
			body: 'demo body for test'
		});

		event.save();
	});

});
