var cookbook = angular.module('cookbook', ['ngRoute', 'cbControllers', 'cbFilters', 'cbConfig']);

cookbook.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'SearchCtrl',
            templateUrl: 'partials/search.html'
        })

        .when('/new', {
            controller: 'NewCtrl',
            templateUrl: 'partials/new.html'
        })

        .when('/recipes/:recipeId', {
            controller: 'RecipeCtrl',
            templateUrl: 'partials/recipe.html'
        })

        .otherwise({
            redirectTo: '/'
        });
}]);
