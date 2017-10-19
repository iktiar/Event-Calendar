angular.module('realtimeData', ['ngRoute', 'realtimeData.data', 'ui.calendar'])
.controller('DashboardCtrl', ['$scope', 'Events', 'socketio', '$http', '$location', 
    function ($scope, Events, socketio, $http, $location) {
        'use strict';
        
        const date = new Date();
        const d = date.getDate();
        const month = date.getMonth();
        const y = date.getFullYear();
        
        $scope.events = Events.query();
        
        /* event sources for calendar*/
        $scope.eventSources = [$scope.events];

        /* alert on eventClick */
        $scope.alertOnEventClick = function( date, jsEvent, view){
            $scope.alertMessage = (date.title + ' was clicked '+date._id);
            $location.path( "/edit/"+date._id);
        };

        /* config object */
        $scope.uiConfig = {
          calendar:{
            height: 450,
            editable: true,
            header:{
              //left: 'month basicWeek basicDay agendaWeek agendaDay',
              //center: 'title',
              right: 'today prev,next'
          },
          dayClick: function(date, jsEvent, view) { 
                //console.log('Day clicking'+event);
                console.log('Clicked on: ' + date.format('YYYY-MM-DD'));
                let event_date = date.format('YYYY-MM-DD');
                $location.path( "/new/"+event_date);
                
            },
            viewRender: function(view, element) {
               // console.log("View Changed: ", view.start, view.end);
               
           },
           eventClick: $scope.alertOnEventClick,
           eventDrop: $scope.alertOnDrop,
           eventResize: $scope.alertOnResize
       }
   };
   
        //catch event from server, update accordingly
        socketio.on('ticket', function (msg) {
            $scope.events.push(msg);
        });
        socketio.on('ticket-delete', function (msg) {
            $scope.events.splice($scope.events.findIndex(function(val){ return val._id == msg}), 1);
        });
    }])
.controller('CreateCtrl', ['$scope', '$location', '$routeParams', 'Events', function ($scope, $location, $routeParams, Events) {
    'use strict';

    $scope.save = function (newTicket) {
        newTicket.start = $routeParams.event_date;
        Events.save(newTicket);
        $location.path('/');
    };
    $scope.cancel = function () {
        $location.path('/');
    };

}])
.controller('EditCtrl', ['$scope', '$location', '$routeParams', 'Events', function ($scope, $location, $routeParams,  Events) {
    'use strict';
        //get event by eventid         
        $scope.newTicket = Events.get($routeParams.id); 

        $scope.save = function (newTicket) {
            Events.save(newTicket);
            $location.path('/');
        };
        $scope.update = function (newTicket) {
            console.log('update...');
            Events.update($routeParams.id,newTicket);
            $location.path('/');
        };
        $scope.delete = function (newTicket) {
           if (confirm("Are you sure?")) {
                 //delete event by eventid         
                 $scope.newTicket = Events.delete($routeParams.id); 
                 alert("Event deleted successfully");
                 $location.path('/');
             }
             
         };
         $scope.cancel = function () {
            $location.path('/');
        };

    }])
.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    
    $routeProvider
    .when('/', {
        controller: 'DashboardCtrl',
        templateUrl: 'partials/dashboard.html'
    })
    .when('/new/:event_date', {
        controller: 'CreateCtrl',
        templateUrl: 'partials/event.html'
    })
    .when('/edit/:id', {
        controller: 'EditCtrl',
        templateUrl: 'partials/event.html'
    })
    .otherwise({
        redirectTo: '/'
    });
}])
.filter('reverse', function () {
    'use strict';
    
    return function (items) {
        return items.slice().reverse();
    };
})
    // From http://briantford.com/blog/angular-socket-io
    .factory('socketio', ['$rootScope', function ($rootScope) {
        'use strict';
        
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    }]);