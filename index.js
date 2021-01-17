var express = require('express'),
    bodyParser = require('body-parser'),

    uuid = require('node-uuid'),
    async = require('async'),
    _ = require('lodash'),

    fs = require('fs');


var app = express();

var env = process.env.NODE_ENV || 'development';

if (env === 'production') {
    app.use(express.static(__dirname + '/client/build'));
} else {
    app.use(express.static(__dirname + '/client/src'));
}

app.use(function(req, res, next) {
    res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Auth-Token , Invitation-Token',
		'Access-Control-Expose-Headers': 'Auth-Token'
	});

	//Send OK if preflight request
	if (req.method === 'OPTIONS') {
		res.status(200);
	} else {
		next();
	}
});

app.use(bodyParser.json());

//Load configuration and start server
fs.readFile('config.json', {encoding: 'utf8'}, function(err, data) {
	if (err) {
		console.log('Error loading configuration file!');
		throw err;
	}

	var config = JSON.parse(data);

	//App configuration
	for (var key in config.app) {
		app.set(key, config.app[key]);
	}

	//Start server
	app.listen(app.get('port'));
	console.log('Listening on port ' + app.get('port') + '...');
});



app.get('/recipes', function(req, res) {
    fs.readdir('recipes/', function(err, files) {
        if (err) {
            throw err;
        }

        var recipes = [];

        async.each(files, function(file, callback) {
            fs.readFile('recipes/' + file, function(err, data) {
                if (err) {
                    callback(err);
                }

                recipes.push(JSON.parse(data));

                callback(null);
            });
        }, function(err) {
            if (err) {
                throw err;
            }

            res.status(200).send(recipes);
        });
    });
});

app.get('/recipes/:recipeId', function(req, res) {
    fs.readFile('recipes/' + req.params.recipeId + '.json', function(err, data) {
        if (err) {
            res.status(404);
            throw err;
        }

        res.status(200).send(JSON.parse(data));
    });
});

app.post('/recipes', function(req, res) {
    var newRecipe = req.body;

    var id = uuid.v4();
    newRecipe.id = id;

    fs.writeFile('recipes/' + id + '.json', JSON.stringify(newRecipe), function(err) {
        if (err) {
            throw err;
        }

        res.status(201).send(newRecipe);
    });
});

app.put('/recipes/:recipeId', function(req, res) {
    fs.writeFile('recipes/' + req.params.recipeId + '.json', JSON.stringify(req.body), function(err) {
        if (err) {
            throw err;
        }

        res.status(200).send(req.body);
    });
});

app.delete('/recipes/:recipeId', function(req, res) {
    fs.unlink('recipes/' + req.params.recipeId + '.json', function(err) {
        if (err) {
            res.status(404);
            throw err;
        }

        res.status(200);
    });
});


app.get('/categories', function(req, res) {
    fs.readdir('recipes/', function(err, files) {
        if (err) {
            throw err;
        }

        var categories = [];

        async.each(files, function(file, callback) {
            fs.readFile('recipes/' + file, function(err, data) {
                if (err) {
                    callback(err);
                }

                var recipe = JSON.parse(data);

                categories = categories.concat(recipe.categories);

                callback(null);
            });
        }, function() {
            categories.sort();
            res.status(200).send(_.uniq(categories, true));
        });
    });
});
