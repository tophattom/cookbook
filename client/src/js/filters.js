var cbFilters = angular.module('cbFilters', []);

cbFilters.filter('multiFilter', ['filterFilter', function(filterFilter) {
    return function(input, query) {
        var keywords = query.split(' ');

        keywords.forEach(function(keyword) {
            input = filterFilter(input, keyword);
        });

        return input;
    };
}]);
