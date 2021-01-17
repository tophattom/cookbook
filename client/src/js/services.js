var cbServices = angular.module('cbServices', ['ngResource']);

cbServices.factory('Recipe', ['$resource', function($resource) {
    return $resource('/recipes/:recipeId', {recipeId: '@id'}, {
        update: {method: 'PUT'}
    });
}]);
