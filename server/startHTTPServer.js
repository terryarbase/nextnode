/**
 * Configures and starts express server.
 *
 * Events are fired during initialisation to allow customisation, including:
 *   - onHttpServerCreated
 *
 * consumed by lib/core/start.js
 *
 * @api private
 */

var http = require('http');

module.exports = function (keystone, app, callback) {

	var host = keystone.get('host');
	var port = keystone.get('port');
	var forceSsl = (keystone.get('ssl') === 'force');

	keystone.httpServer = http
	.createServer((req, res) => {
		if (forceSsl) {
			console.log('The http server to be run in HTTPS - ', `https://${req.headers.host}${req.url}`);
			res.writeHead(301, { 
				'Location': `https://${req.headers.host}${req.url}`,
			});
	    	res.end();
	    }
	    return app(req, res);
	})
	.listen(port, host, function ready (err) {
		if (err) { return callback(err); }

		var message = keystone.get('name') + ' is ready on '
		+ 'http://' + host + ':' + port
		+ (forceSsl ? ' (SSL redirect)' : '');
		callback(null, message);
	});

};
