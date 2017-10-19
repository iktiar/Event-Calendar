angular.module('realtimeData.data', ['ngResource']).factory('Events', ['$resource', function($resource) {
    'use strict';
    
    let resource = $resource('/events/:id', null, 
        {
            'update': { method:'PUT' }
        }
    );
    
    return {
        save: function (Event) {
            resource.save(Event);
        },
        update: function(id, Event) {
           return resource.update({id:id}, Event);
        },
        query: function () {
            return resource.query();
        },
        get: function (id) {
            return resource.get({id:id});
        },
        delete: function (id) {
            return resource.delete({id:id});
        }
    };
}]);