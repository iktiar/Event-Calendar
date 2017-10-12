const assert = require('assert');
const Event  = require('../models/event')

describe('Creating records', () => {
 it('saves a event', () => {
 	const event = new Event({ title: 'demo event 2', body: 'demo body 2'});

 	event.save();
 });

});
