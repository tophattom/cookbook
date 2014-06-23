var cbFilters = angular.module('cbFilters', []);

cbFilters.filter('multiFilter', ['filterFilter', function(filterFilter) {
    return function(input, query) {
        var keywords = query.split(' '),
            out = [];

        keywords.forEach(function(keyword) {
            out = out.concat(filterFilter(input, keyword));
        });

        out = out.filter(function(elem, index) {
            return out.indexOf(elem) == index;
        });

        return out;
    };
}]);
