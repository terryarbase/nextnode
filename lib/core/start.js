/**
 * Configures and starts a Keystone app in encapsulated mode.
 *
 * Connects to the database, runs updates and listens for incoming requests.
 *
 * Events are fired during initialisation to allow customisation, including:
 *
 *   - onMount
 *   - onStart
 *   - onHttpServerCreated
 *   - onHttpsServerCreated
 *
 * If the events argument is a function, it is assumed to be the started event.
 *
 * @api public
 */
const async 						= require('async');
const localizationHookPlugin        = require('./hook/localization');

var dashes = '\n------------------------------------------------\n';

 function start (events) {

	if (typeof events === 'function') {
		events = { onStart: events };
	}
	if (!events) events = {};

	function fireEvent (name) {
		if (typeof events[name] === 'function') {
			events[name]();
		}
	}

	process.on('uncaughtException', function (e) {
		if (e.code === 'EADDRINUSE') {
			console.log(dashes
				+ keystone.get('name') + ' failed to start: address already in use\n'
				+ 'Please check you are not already running a server on the specified port.\n');
			process.exit();
		} else {
			console.log(e.stack || e);
			process.exit(1);
		}
	});
	var keystone = this;

	
	// create a delegated account for AdminUI
	this.createAccount();
	// create localzation model no matter the .get('localization') is set.
	this.createLocalization();
	// create app-language and nav-language sections
	if (this.get('rbac')) {
		this.createRole();
	}
	// console.log('> ', this.get('country model'));
	if (this.get('country model')) {
		this.createCountry(this.get('country model'));
	}
	this.delegatedLanguageSection.createLanguageSection(this);
	this.delegatedNavLanguageSection.createNavLanguageSection(this);

	// this.createLanguageSection();
	// this.createNavLanguageSection();

	// this.initNav(this.get('nav'));

	// register localization hook
	// localizationHookPlugin();

	this.initExpressApp();

	// console.log('>>>>>', this.get('nav'));

	
	var app = keystone.app;

	this.openDatabaseConnection(function () {

		fireEvent('onMount');

		var ssl = keystone.get('ssl');
		var unixSocket = keystone.get('unix socket');
		var startupMessages = [`NextNodeCMS v${keystone.version} started:`];

		async.parallel([
			// HTTP Server
			function (done) {
				if (ssl === 'only' || unixSocket) return done();
				require('../../server/startHTTPServer')(keystone, app, function (err, msg) {
					fireEvent('onHttpServerCreated');
					startupMessages.push(msg);
					done(err);
				});
			},
			// HTTPS Server
			function (done) {
				if (!ssl || unixSocket) return done();
				require('../../server/startSecureServer')(keystone, app, function () {
					fireEvent('onHttpsServerCreated');
				}, function (err, msg) {
					startupMessages.push(msg);
					done(err);
				});
			},
			// Unix Socket
			function (done) {
				if (!unixSocket) return done();
				require('../../server/startSocketServer')(keystone, app, function (err, msg) {
					fireEvent('onSocketServerCreated');
					startupMessages.push(msg);
					done(err);
				});
			},
		], function serversStarted (err, messages) {
			if (keystone.get('logger')) {
				console.log(dashes + startupMessages.join('\n') + dashes);
			}
			fireEvent('onStart');
		});
	});

	return this;
}

module.exports = start;
