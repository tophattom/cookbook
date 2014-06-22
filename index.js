var express = require('express'),
    bodyParser = require('body-parser'),

    r = require('rethinkdb'),

    fs = require('fs');


var app = express();

app.use(function(req, res, next) {
    res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, Auth-Token , Invitation-Token',
		'Access-Control-Expose-Headers': 'Auth-Token'
	});

	//Send OK if preflight request
	if (req.method === 'OPTIONS') {
		res.send(200);
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

	//Initialize database connection
	r.connect({host: config.database.host, port: config.database.port}, function(err, conn) {
		if (err) {
			throw err;
		}

		connection = conn;
		connection.use(config.database.database);
	});

	//App configuration
	for (key in config.app) {
		app.set(key, config.app[key]);
	}

	//Start server
	app.listen(app.get('port'));
	console.log('Listening on port ' + app.get('port') + '...');
});



app.get('/recipes', function(req, res) {
    r.table('recipes').run(connection, function(err, cursor) {
        if (err) {
            throw err;
        }

        cursor.toArray(function(err, result) {
            if (err) {
                throw err;
            }

            res.send(200, result);
        });
    });
});

app.get('/recipes/:recipeId', function(req, res) {
    r.table('recipes').get(req.params.recipeId).run(connection, function(err, result) {
        if (err) {
            throw err;
        }

        res.send(200, result);
    });
});

app.post('/recipes', function(req, res) {
    var newRecipe = req.body;

    r.table('recipes').insert(newRecipe, {returnVals: true}).run(connection, function(err, result) {
        if (err) {
            throw err;
        }

        res.send(201, result.new_val);
    });
});
