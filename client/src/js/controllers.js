var cbControllers = angular.module('cbControllers', ['ngRoute', 'ngResource', 'cbServices']);

cbControllers.controller('SearchCtrl', ['$scope', 'Recipe', function($scope, Recipe) {
    $scope.recipes = Recipe.query();

    $scope.searchQuery = '';
}]);

cbControllers.controller('NewCtrl', ['$scope', '$http', 'Recipe', 'BACKEND_URL', function($scope, $http, Recipe, BACKEND_URL) {
    $scope.newRecipe = initRecipe();

    $scope.newIngredient = initIngredient();
    $scope.newStep = '';

    $scope.categories = [];
    $http.get(BACKEND_URL + 'categories').success(function(data) {
        $scope.categories = data;
    });

    $scope.newCategory = '';


    $scope.addIngredient = function() {
        $scope.newRecipe.ingredients.push($scope.newIngredient);

        $scope.newIngredient = initIngredient();
    };

    $scope.removeIngredient = function(index) {
        $scope.newRecipe.ingredients.splice(index, 1);
    };

    $scope.addStep = function() {
        $scope.newRecipe.steps.push($scope.newStep);
        $scope.newStep = '';
    };

    $scope.removeStep = function(index) {
        $scope.newRecipe.steps.splice(index, 1);
    };

    $scope.addRecipe = function() {
        $scope.newRecipe.$save().then(function() {
            $scope.newRecipe = initRecipe();
        });
    };

    $scope.addCategory = function() {
        $scope.newCategory = $scope.newCategory.toLowerCase();

        $scope.newRecipe.categories.push($scope.newCategory);
        $scope.categories.push($scope.newCategory);

        $scope.newCategory = '';
    };


    function initRecipe() {
        var newRecipe = new Recipe();

        newRecipe.ingredients = [];
        newRecipe.steps = [];
        newRecipe.categories = [];

        return newRecipe;
    }

    function initIngredient() {
        return {
            amount: '',
            name: ''
        };
    }
}]);


cbControllers.controller('RecipeCtrl', ['$scope', '$routeParams', '$window', '$location', 'Recipe', function($scope, $routeParams, $window, $location, Recipe) {
    $scope.recipe = Recipe.get({recipeId: $routeParams.recipeId});

    $scope.deleteRecipe = function() {
        var confirmed = $window.confirm('Haluatko varmasti poistaa reseptin?');

        if (confirmed) {
            $scope.recipe.$delete().then(function() {
                $location.path('/');
            });
        }
    };
}]);


cbControllers.controller('EditCtrl', ['$scope', '$routeParams', '$location', '$http', 'Recipe', 'BACKEND_URL',
    function($scope, $routeParams, $location, $http, Recipe, BACKEND_URL) {
        $scope.recipe = Recipe.get({recipeId: $routeParams.recipeId});

        $scope.newIngredient = initIngredient();
        $scope.newStep = '';

        $scope.categories = [];
        $http.get(BACKEND_URL + 'categories').success(function(data) {
            $scope.categories = data;
        });

        $scope.newCategory = '';

        $scope.addIngredient = function(index) {
            if (typeof index !== 'undefined') {
                $scope.recipe.ingredients.splice(index, 0, $scope.newIngredient);
            } else {
                $scope.recipe.ingredients.push($scope.newIngredient);
            }
            
            $scope.newIngredient = initIngredient();
        };

        $scope.removeIngredient = function(index) {
            $scope.recipe.ingredients.splice(index, 1);
        };

        $scope.addStep = function() {
            $scope.recipe.steps.push($scope.newStep);
            $scope.newStep = '';
        };

        $scope.removeStep = function(index) {
            $scope.recipe.steps.splice(index, 1);
        };

        $scope.updateRecipe = function() {
            Recipe.update({}, $scope.recipe, function() {
                $location.path('/recipes/' + $scope.recipe.id);
            });
        };

        $scope.addCategory = function() {
            if (!$scope.recipe.categories) {
                $scope.recipe.categories = [];
            }

            $scope.newCategory = $scope.newCategory.toLowerCase();

            $scope.recipe.categories.push($scope.newCategory);
            $scope.categories.push($scope.newCategory);

            $scope.newCategory = '';
        };

        function initIngredient() {
            return {
                amount: '',
                name: ''
            };
        }
    }]);
