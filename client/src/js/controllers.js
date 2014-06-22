var cbControllers = angular.module('cbControllers', ['ngRoute', 'ngResource', 'cbServices']);

cbControllers.controller('SearchCtrl', ['$scope', 'Recipe', function($scope, Recipe) {
    $scope.recipes = Recipe.query();

    $scope.searchQuery = '';
}]);

cbControllers.controller('NewCtrl', ['$scope', 'Recipe', function($scope, Recipe) {
    $scope.newRecipe = initRecipe();

    $scope.newIngredient = initIngredient();
    $scope.newStep = '';


    $scope.addIngredient = function() {
        $scope.newRecipe.ingredients.push($scope.newIngredient);

        $scope.newIngredient = initIngredient();
    };

    $scope.addStep = function() {
        $scope.newRecipe.steps.push($scope.newStep);
        $scope.newStep = new String();
    };


    $scope.addRecipe = function() {
        $scope.newRecipe.$save().then(function() {
            $scope.newRecipe = initRecipe();
        });
    };


    function initRecipe() {
        var newRecipe = new Recipe();

        newRecipe.ingredients = [];
        newRecipe.steps = [];

        return newRecipe;
    }

    function initIngredient() {
        return {
            amount: '',
            name: ''
        };
    }
}]);


cbControllers.controller('RecipeCtrl', ['$scope', '$routeParams', 'Recipe', function($scope, $routeParams, Recipe) {
    $scope.recipe = Recipe.get({recipeId: $routeParams.recipeId});
}]);
