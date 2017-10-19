# Event-Calendar with realtime update
Event Calendar using MEAN stack

First of all, it was fun. 
Specially when finally real time ‘event’ updates from differnt browser, all hard work paid off :)
This is my first project with MEAN stack, I have tried to separate folder structure for relevant files.
#### Features:

1. Real time event add/edit/delete  with monthly view.
2. mobile view,  desktop view. (Monthly and row style day view)

Folder names are self explanatory. Still more description given below.
1. Server : nodejs express as backend server. Providing Rest API for ‘Events’ with Mongodb using Mongooes.
    1. Server/routes: used to store all route files, currently all ‘events’ routes stored here.
    2. Server/database : have db related stuff, like ‘Models’ , our only ‘Event’ Model.
        1. Connection.js: have db connection module , e.g ‘connect’,  ‘disconnect’.
2. App:  Frontend with angular.  

Rest API implemented in Backend in following  


|      HTTP   | API End point           | Description  |
| ------------- |:-------------:| -----:|
| GET     | /events | get all events|
| POST    | /events | create new event |
| GET     | /events/eventid  |  get event by event id |
| PUT     | /events/eventid  |  update event by event id |
| DELETE  | /events/eventid  |  delete event by event id |

###### Real-time bidirectional event-based communication  using Socket.io.

1. In backend nodejs, for event ‘post/put/delete’, socket.io enables bidirectional communication 
       between server and client.

###### Mongodb for persistence, using Mongoose api, used in rest api.

## Locally setup and run event calendar:
1. clone to locally by :
   git clone https://github.com/iktiar/Event-Calendar.git

2. Install node packages, run follwoing from project folder(folder with  'package.json' file):
   > npm install
3. Install Bower packages   
   > bower install  
    1. if following message come ‘Unable to find a suitable version for angular..’, choose option 3 (angular#~1.4.x)

4. prerequisite:
   1. node , npm 
   2. database: mongodb locally installed and running. (my local version v3.4.5)
      Run the following in your Terminal to check , this should return at least 1: 
          > ps -ef | grep mongod | grep -v grep | wc -l | tr -d ' '
   3. modern web browser.
 
###### run application on port:3000, please make sure that port is free 
 1. From ‘server’ folder,run in terminal: 
 	> node index.js
 2. go to http://localhost:3000     
        [you should see ‘db connection ok!’ in terminal,
        if  message ’error in db connection!’ shown, check DB is running, or db connection url in ‘database/models/’]

3. now click on any date box to add Event, and click on ‘event’ in date box to edit event.
   
###### test case run, from project folder, terminal run following.
1. npm run test
