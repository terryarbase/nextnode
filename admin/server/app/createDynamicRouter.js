var bodyParser = require('body-parser');
var express = require('express');
var multer = require('multer');

const requestMiddleware = require('../middleware/request');
const combinePermission = require('../middleware/combinePermission');

module.exports = function createDynamicRouter (keystone) {
	// ensure keystone nav has been initialised
	// TODO: move this elsewhere (on demand generation, or client-side?)
	// console.log('keystone: ', keystone.get('name'), keystone.get('nav style'));
	// if rbac is enabled, nav will be initialized on demand
	if (!keystone.get('rbac') && !keystone.nav) {
		keystone.nav = keystone.initNav();
	}

	var router = express.Router();
	var IndexRoute = require('../routes/index');
	var SigninRoute = require('../routes/signin');
	var SignoutRoute = require('../routes/signout');
	// Use bodyParser and multer to parse request bodies and file uploads
	router.use(bodyParser.json({}));
	router.use(bodyParser.urlencoded({ extended: true }));
	router.use(keystone.get('i18n').init);
	router.use(multer({ includeEmptyFields: true }));

	// Bind the request to the keystone instance
	router.use(function (req, res, next) {
		requestMiddleware(req, res, next, keystone);
		// req.keystone = keystone;
	});

	if (keystone.get('healthchecks')) {
		router.use('/server-health', require('./createHealthchecksHandler')(keystone));
	}

	// Init API request helpers
	router.use('/api', require('../middleware/apiError'));
	router.use('/api', require('../middleware/logError'));

	// #0 rbac middleware
	var checkPermission = require('../middleware/checkPermission');
	/*
	** [V2 Enhancement]
	** Get the static locals config using rest api
	** Terry Chan
	** 08/10/2019
	*/
	router.get('/app/config', checkPermission(0), require('../api/config'));

	// #1: Session API
	// TODO: this should respect keystone auth options
	router.get('/api/session', require('../api/session/get'));
	router.post('/api/session/signin', require('../api/session/signin'));
	router.post('/api/session/signout', require('../api/session/signout'));

	// #2: Session Routes
	// Bind auth middleware (generic or custom) to * routes, allowing
	// access to the generic signin page if generic auth is used
	if (keystone.get('auth') === true) {
		// TODO: poor separation of concerns; settings should be defaulted elsewhere
		if (!keystone.get('signout url')) {
			keystone.set('signout url', '/' + keystone.get('admin path') + '/signout');
		}
		if (!keystone.get('signin url')) {
			keystone.set('signin url', '/' + keystone.get('admin path') + '/signin');
		}
		if (!keystone.nativeApp || !keystone.get('session')) {
			router.all('*', keystone.session.persist);
		}
		router.all('/signin', SigninRoute);
		router.all('/signout', SignoutRoute);
		router.all('/api*', keystone.session.keystoneAuth);
	} else if (typeof keystone.get('auth') === 'function') {
		router.use(keystone.get('auth'));
	}

	// #3: Home route
	// router.get('/', function(req, res) {
	// 	const render = true;
	// 	combinePermission(req, res);
	// 	return IndexRoute(req, res, render);
	// });
	
	// #4: Cloudinary and S3 specific APIs
	// TODO: poor separation of concerns; should / could this happen elsewhere?
	if (keystone.get('cloudinary config')) {
		router.get('/api/cloudinary/get', require('../api/cloudinary').get);
		router.get('/api/cloudinary/autocomplete', require('../api/cloudinary').autocomplete);
		router.post('/api/cloudinary/upload', require('../api/cloudinary').upload);
	}
	if (keystone.get('s3 config')) {
		router.post('/api/s3/upload', require('../api/s3').upload);
	}

	// #5: Core Lists API
	const initList = require('../middleware/initList');
	const initDataPermission = require('../middleware/initDataPermission');
	// lists
	router.all('/api/counts', initDataPermission, require('../api/counts'));
	// if (serviceWorker) {
	/*
	** register for the current login user (e.g. browser device id)
	** Terry Chan
	** 29/03/2019
	*/ 
	router.post('/api/register', require('../api/common/register'));
	// }

	router.get(
		'/api/:list',
		initList,
		checkPermission(1, { allowBasic: true }),
		initDataPermission,
		require('../api/list/get'),
	);
	router.get(
		'/api/:list/:format(export.excel|export.json|export.txt)',
		initList,
		checkPermission(1),
		initDataPermission,
		require('../api/list/download'),
	);
	router.post(
		'/api/:list/create',
		initList,
		checkPermission(2),
		require('../api/list/create'),
	);
	router.post(
		'/api/:list/update',
		initList,
		checkPermission(2),
		initDataPermission,
		require('../api/list/update'),
	);
	// only refer to the current login user operations
	router.post(
		'/api/:list/updateMyProfile',
		initList,
		checkPermission(2),
		(req, res) => {
			const Account = require('../api/account');
			new Account(req, res).updateMyProfile();
		}
	);
	// realtime save
	// router.post('/api/:list/realtime',
	// 	initList,
	// 	checkPermission(2),
	// 	(req, res) => {
	// 		console.log('>>>>>>>>>', req.body, req.query);
	// 	}
	// );
	router.post(
		'/api/:list/delete',
		initList, checkPermission(2),
		initDataPermission,
		require('../api/list/delete'),
	);
	// router.post('/api/:list/delete', initList, checkPermission(2), require('../api/list/delete'));
	// items
	router.get(
		'/api/:list/:id',
		initList,
		checkPermission(1, { allowBasic: true }),
		initDataPermission,
		require('../api/item/get'),
	);
	router.post(
		'/api/:list/:id',
		initList,
		checkPermission(2),
		initDataPermission,
		require('../api/item/update'),
	);
	router.post(
		'/api/:list/:id/delete',
		initList, checkPermission(2),
		initDataPermission,
		require('../api/list/delete'),
	);
	router.post(
		'/api/:list/:id/sortOrder/:sortOrder/:newOrder',
		initList, checkPermission(2),
		require('../api/item/sortOrder'),
	);

	// #6: List Routes
	router.all('/*', function(req, res) {
		const render = true;
		combinePermission(req, res);
		return IndexRoute(req, res, render);
	});
	// router.all('/:list/:item', function(req, res) {
	// 	const render = true;
	// 	return IndexRoute(req, res, render);
	// });

	// TODO: catch 404s and errors with Admin-UI specific handlers

	return router;
};
