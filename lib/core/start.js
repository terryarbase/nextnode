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
const asynchronous 					= require('async');
const localizationHookPlugin        = require('./hook/localization');

var dashes = '\n------------------------------------------------\n';

 async function start (events) {

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

	if (this.get('country model')) {
		this.createCountry();
	}

	// create a delegated account for AdminUI
	this.createAccount();
	// create localzation model no matter the .get('localization') is set.
	this.createLocalization();

	this.createSystemIdentity();

	/*
	** [ Debuging ]
	** create table permission
	** use for cms user data filter
	** Fung Lee
	** 10/6/2019
	*/
	this.createPermission();

	/*
	** Support multiple roles
	** Note: Role must be create at last,
	** otherwise Super Administrator's table permissions list will miss table
	** then throw error on combine permission action
	** Fung Lee
	** 25/4/2019
	*/
	// if (this.get('rbac')) {
	// 	this.createRole();
	// }

	// create first admin account
	this.createDelegatedAdmin();
	
	// create app-language and nav-language sections
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

		asynchronous.parallel([
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

			keystone.addToDelegationModelList();

			fireEvent('onStart');
		});
	});

	return this;
}

module.exports = start;
