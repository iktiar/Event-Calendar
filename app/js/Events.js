angular.module('realtimeData.data', ['ngResource']).factory('Events', ['$resource', function($resource) {
    'use strict';
    
    let date = new Date();
    let month = date.getMonth();
    let server = $resource('/events/:id', null, 
    {
        'update': { method:'PUT' }
    }
    );
    
    return {
        save: function (Event) {
            server.save(Event);
        },
        update: function(id, Event) {
           return server.update({id:id}, Event);
           
       },
       query: function () {
        return server.query();
    },
    get: function (id) {
        return server.get({id:id});
    },
    delete: function (id) {
        return server.delete({id:id});
    }
};
}]);