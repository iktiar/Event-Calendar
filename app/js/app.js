angular.module('realtimeData', ['ngRoute', 'realtimeData.data', 'ui.calendar'])
.controller('DashboardCtrl', ['$scope', 'Events', 'socketio', '$http', '$location', 
    function ($scope, Events, socketio, $http, $location) {
        'use strict';
        
        const date = new Date();
        
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
            height: 500,
            editable: true,
            header:{
              left: 'month agendaDay',
              //center: 'title',
              right: 'today prev,next'
          },
          dayClick: function(date, jsEvent, view) { 
                let event_date = date.format('YYYY-MM-DD');
                $location.path( "/new/"+event_date);
                
            },
            viewRender: function(view, element) {
               //console.log("View Changed: ", view.start, view.end);
               let startDate = view.start;
               let endDate = view.end;
               
               $http({
                      method : "GET",
                      url : "/events/"+startDate+"/"+endDate
                    }).then(function Success(response) {
                            $scope.events1 = response.data;
                            /* event sources for calendar*/
                            $scope.eventSources = [$scope.events1];
                        }, function Error(response) {
                            
                        });

           },
           eventClick: $scope.alertOnEventClick,
           eventDrop: $scope.alertOnDrop,
           eventResize: $scope.alertOnResize
          }
        };

        //catch event from server, update accordingly
        socketio.on('event-post', function (msg) {
            $scope.events.push(msg);
        });
        socketio.on('event-update', function (msg) {
            //remove existing event, for duplicate add issue.
            $scope.events.splice($scope.events.findIndex(function(val){ return val._id == msg._id}), 1);
            $scope.events.push(msg);
        });
        socketio.on('event-delete', function (msg) {
            $scope.events.splice($scope.events.findIndex(function(val){ return val._id == msg}), 1);
        });
    }])
.controller('CreateCtrl', ['$scope', '$location', '$routeParams', 'Events', function ($scope, $location, $routeParams, Events) {
    'use strict';

    $scope.save = function (newEvent) {
        newEvent.start = $routeParams.event_date;
        Events.save(newEvent);
        $location.path('/');
    };
    $scope.cancel = function () {
        $location.path('/');
    };

}])
.controller('EditCtrl', ['$scope', '$location', '$routeParams', 'Events', function ($scope, $location, $routeParams,  Events) {
    'use strict';
        //get event by eventid         
        $scope.event = Events.get($routeParams.id); 

        $scope.save = function (Event) {
            Events.save(Event);
            $location.path('/');
        };
        $scope.update = function (Event) {
            Events.update($routeParams.id,Event);
            $location.path('/');
        };
        $scope.delete = function (Event) {
           if (confirm("Are you sure?")) {
                 //delete event by eventid         
                 Events.delete($routeParams.id); 
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
