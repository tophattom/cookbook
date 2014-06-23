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


cbControllers.controller('EditCtrl', ['$scope', '$routeParams', '$location', 'Recipe', function($scope, $routeParams, $location, Recipe) {
    $scope.recipe = Recipe.get({recipeId: $routeParams.recipeId});

    $scope.newIngredient = initIngredient();
    $scope.newStep = '';


    $scope.addIngredient = function() {
        $scope.recipe.ingredients.push($scope.newIngredient);

        $scope.newIngredient = initIngredient();
    };

    $scope.removeIngredient = function(index) {
        $scope.recipe.ingredients.splice(index, 1);
    };

    $scope.addStep = function() {
        $scope.recipe.steps.push($scope.newStep);
        $scope.newStep = new String();
    };

    $scope.removeStep = function(index) {
        $scope.recipe.steps.splice(index, 1);
    };

    $scope.updateRecipe = function() {
        Recipe.update({}, $scope.recipe, function() {
            $location.path('/recipes/' + $scope.recipe.id);
        });
    };

    function initIngredient() {
        return {
            amount: '',
            name: ''
        };
    }

}]);
