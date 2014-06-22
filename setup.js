var r = require('rethinkdb'),
	async = require('async'),
	fs = require('fs');


var config = {},
	connection = null;

//Define databases and tables that should be on the server and functions for creating them
var databases = [
	{
		name: 'cookbook',
		create: function(callback) {
			r.dbCreate(config.database).run(connection, function(err, result) {
				if (err) {
					callback(err);
					return;
				}

				console.log('Database "' + config.database + '" created!');

				connection.use(config.database);
				callback(null);
			});
		},
		tables: [
			{
				name: 'recipes',
				create: function(callback) {
					r.tableCreate('recipes').run(connection, function(err, result) {
						if (err) {
							callback(err);
							return;
						}

						console.log('Table "recipes" created!');
					});
				}
			}
		]
	}
];


//Load configuration and start server
fs.readFile('config.json', {encoding: 'utf8'}, function(err, data) {
	if (err) {
		console.log('Error loading configuration file!');
		throw err;
	}

	config = JSON.parse(data).database;

	//Initialize database connection
	r.connect({host: config.host, port: config.port}, function(err, conn) {
		if (err) {
			throw err;
		}

		connection = conn;

		setupDatabase();
	});
});


function setupDatabase() {
	r.dbList().run(connection, function(err, existingDatabases) {
		if (err) {
			throw err;
		}

		databases.forEach(function(database) {
			console.log(database.name);

			if (existingDatabases.indexOf(database.name) === -1) {
				async.series([database.create], function() {
					connection.use(database.name);
					createTables(database);
				});
			} else {
				connection.use(database.name);
				createTables(database);
			}
		});
	});
}

function createTables(database) {
	r.db(database.name).tableList().run(connection, function(err, existingTables) {
		if (err) {
			throw err;
		}

		var creationQueue = [];
		database.tables.forEach(function(table) {
			if (existingTables.indexOf(table.name) === -1) {
				creationQueue.push(table.create);
			}
		});

		console.log(creationQueue);

		async.series(creationQueue, function(result) {
			return true;
		});
	});
};
