const assert = require('assert');
const Event  = require('../models/events')

describe('Creating records', () => {
 it('saves a event', () => {
 	const event = new Event({ title: 'demo event test', body: 'demo body for test'});

 	event.save();
 });

});
