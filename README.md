# Event-Calendar
Event Calendar using MEAN stack

##Rest API
1. get events by Month(month number)
api: events/month/{monthNumber}
example: http://localhost:3000/events/month/9
result: 
        [
			{
			"_id": "59df94bb2cebf123fbbe105e",
			"title": "demo event 4",
			"body": "demo body 4",
			"__v": 0,
			"updated": "2017-10-12T16:13:47.367Z",
			"created": "2017-10-12T16:13:47.367Z",
			},
			{
			"_id": "59df96716fcfd62429c09064",
			"title": "demo event test",
			"body": "demo body for test",
			"__v": 0,
			"updated": "2017-10-12T16:21:05.957Z",
			"created": "2017-10-12T16:21:05.957Z",
			}
		]
2. get events by eventId
   api: /events/{eventId}
   example: http://localhost:3000/events/59df94bb2cebf123fbbe105e	
   result:
          {
			"_id": "59df94bb2cebf123fbbe105e",
			"title": "demo event 4",
			"body": "demo body 4",
			"__v": 0,
			"updated": "2017-10-12T16:13:47.367Z",
			"created": "2017-10-12T16:13:47.367Z",
			"event_date": "2017-10-12T16:13:47.367Z"
		}
