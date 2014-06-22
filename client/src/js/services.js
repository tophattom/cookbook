var cbServices = angular.module('cbServices', ['ngResource', 'cbConfig']);

cbServices.factory('Recipe', ['$resource', 'BACKEND_URL', function($resource, BACKEND_URL) {
    return $resource(BACKEND_URL + 'recipes/:recipeId', {recipeId: '@id'}, {
        update: {method: 'PUT'}
    });
}]);
