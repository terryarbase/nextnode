const _ = require('lodash');
const express = require('express');
const grappling = require('grappling-hook');
const path = require('path');
const utils = require('keystone-utils');
const i18n = require('i18n');
var locales = require('./locales');
require('extend-error');
locales = locales.toJS();

const importer = require('./lib/core/importer');
/**
 * Don't use process.cwd() as it breaks module encapsulation
 * Instead, let's use module.parent if it's present, or the module itself if there is no parent (probably testing keystone directly if that's the case)
 * This way, the consuming app/module can be an embedded node_module and path resolutions will still work
 * (process.cwd() breaks module encapsulation if the consuming app/module is itself a node_module)
 */
var moduleRoot = (function (_rootPath) {
	var parts = _rootPath.split(path.sep);
	parts.pop(); // get rid of /node_modules from the end of the path
	return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);


/**
 * Keystone Class
 */
var Keystone = function () {
	grappling.mixin(this).allowHooks('pre:static', 'pre:dynamic', 'pre:bodyparser', 'pre:session', 'pre:logger', 'pre:admin', 'pre:routes', 'pre:render', 'updates', 'signin', 'signout');
	
	const rootPath = __dirname;
	const defaultLang = 'en';
	const defaultAdminPath = 'webadmin';

	/*
	** Localization
	*/
	i18n.configure({
	    locales: _.keys(locales),
	    directory: `${rootPath}/locales/langs/`,
	    defaultLocale: defaultLang,
	    autoReload: true,
	    register: global,
	    updateFiles: false,
	});

	this.lists = {};
	this.fieldTypes = {};
	this.paths = {};
	this._options = {
		'name': 'Keystone',
		'brand': 'Keystone',
		'admin path': defaultAdminPath,
		'compress': true,
		'headless': false,
		'favicon': `${rootPath}/static/images/favicon.ico`,
		'localization': false,
		'logger': ':method :url :status :response-time ms',
		'auto update': false,
		'model prefix': null,
		/*
		** @Terry Chan 26/10/2018
		** for generate localization
		*/
		'locale': defaultLang,
		'support locales': _.keys(locales),
		'app root': rootPath,
		// for store the cookie localization lang
		'cookie frontend locale': 'flang',
		'cookie data locale': 'dlang',
		'cookie language options': {
			// httpOnly: true,
			path: '/',
		},
		'i18n': i18n,
		'static lang path': 'static/locale.json',	// json file for generated language static file 
		'static section path': 'static/section.json',	// json file for AdminUI section language static file
		'static navigation path': 'static/navigation.json',

		'module root': moduleRoot,
		'frame guard': 'sameorigin',
		'cache admin bundles': true,
		/*
		** @Terry Chan 25/11/2018
		** for admin account locking options
		*/
		'admin lock': true,
		'admin max lock': 5,
		'nav style': {
			fontColor: '#ffffff',
			fontHover: '#ffe53d'
		},

		'customized error': {
	        HookCheckError: Error.extend('HookCheckError', 500),
	    },

		'text separator': ', ',
	};
	this._redirects = {};

	// expose express
	this.express = express;

	// init environment defaults
	this.set('env', process.env.NODE_ENV || 'development');

	this.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '3000');
	this.set('host', process.env.HOST || process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
	this.set('listen', process.env.LISTEN);

	this.set('ssl', process.env.SSL);
	this.set('ssl port', process.env.SSL_PORT || '3001');
	this.set('ssl host', process.env.SSL_HOST || process.env.SSL_IP);
	this.set('ssl key', process.env.SSL_KEY);
	this.set('ssl cert', process.env.SSL_CERT);

	this.set('cookie secret', process.env.COOKIE_SECRET);
	this.set('cookie signin', (this.get('env') === 'development') ? true : false);

	this.set('embedly api key', process.env.EMBEDLY_API_KEY || process.env.EMBEDLY_APIKEY);
	this.set('mandrill api key', process.env.MANDRILL_API_KEY || process.env.MANDRILL_APIKEY);
	this.set('mandrill username', process.env.MANDRILL_USERNAME);
	this.set('google api key', process.env.GOOGLE_BROWSER_KEY);
	this.set('google server api key', process.env.GOOGLE_SERVER_KEY);
	this.set('ga property', process.env.GA_PROPERTY);
	this.set('ga domain', process.env.GA_DOMAIN);
	this.set('chartbeat property', process.env.CHARTBEAT_PROPERTY);
	this.set('chartbeat domain', process.env.CHARTBEAT_DOMAIN);
	this.set('allowed ip ranges', process.env.ALLOWED_IP_RANGES);

	if (process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET) {
		this.set('s3 config', { bucket: process.env.S3_BUCKET, key: process.env.S3_KEY, secret: process.env.S3_SECRET, region: process.env.S3_REGION });
	}

	if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
		this.set('azurefile config', { account: process.env.AZURE_STORAGE_ACCOUNT, key: process.env.AZURE_STORAGE_ACCESS_KEY });
	}

	if (process.env.CLOUDINARY_URL) {
		// process.env.CLOUDINARY_URL is processed by the cloudinary package when this is set
		this.set('cloudinary config', true);
	}

	// init mongoose
	this.set('mongoose', require('mongoose'));
	this.mongoose.Promise = require('es6-promise').Promise;
	// Attach middleware packages, bound to this instance
	this.middleware = {
		api: require('./lib/middleware/api')(this),
		cors: require('./lib/middleware/cors')(this),
	};
};

_.extend(Keystone.prototype, require('./lib/core/options'));


Keystone.prototype.prefixModel = function (key) {
	var modelPrefix = this.get('model prefix');

	if (modelPrefix) {
		key = modelPrefix + '_' + key;
	}

	return require('mongoose/lib/utils').toCollectionName(key);
};

Keystone.prototype.isReservedCollection = function (key, options) {
	const reservedPaths = reservedCollectionName;
	return !options.isCore && reservedPaths.indexOf(_.toLower(key)) !== -1;
};

/*
** Check for the reserved language section fields
** e.g. meta, createdAt, updatedAt, createdBy, createdAt
** Terry Chan
** 03/12/2018
*/
Keystone.prototype.isReservedLanguageSectionFields = function (field) {
	const reservedFields = [
		'meta',
		'delegated',
		'createdat',
		'createdby',
		'updatedat',
		'updatedby',
	];
	// console.log(field, reservedFields.indexOf(_.toLower(_.camelCase(field))));
	return reservedFields.indexOf(
		_.toLower(_.camelCase(field))
	) !== -1;
};

/*
** Get reserved collection structure, usually for the navigation options
** Terry Chan
** 03/12/2018
*/
Keystone.prototype.reservedCollections = function () {
	const localization = this.get('localization');
	return {
		system: [
			// 'PermissionListField',
			'Permission',
			// 'Role',
			'SystemIdentity',
			'User',
		],
		localization: [
			...(localization ? ['Locale'] : []),
			'ApplicationLanguage',
			'NavigationLanguage',
		],
	};
};

Keystone.prototype.mergeNavOptionWithReservedCollections = function () {
	const nav = this.get('nav');
	const reserved = this.reservedCollections();
	var newNav = { ...reserved };
	_.keys(nav).forEach(n => {
		// if the client delcare the same nav key, then merge it into one options after the reserved options
		if (newNav[n]) {
			newNav[n] = [
				...newNav[n],
				...nav[n],
			];
		} else {
			newNav = {
				...newNav,
				...{
					[n]: nav[n],
				},
			};
		}
	});
	return newNav;
};

// sepcial for keystone.get('role list') use
Keystone.prototype.reservedRoleListCollections = function () {
	return {
		...{
			// 'Role': true,
			'User': true,
		},
		...(this.get('localization') ? { 'Locale': true } : {}),
		...{
			'ApplicationLanguage': true,
			'NavigationLanguage': true,
		},
	};
};

/*
** Below use for permission
** Fung Lee
** 12/07/2019
*/
Keystone.prototype.reservedPermissionKeyList = function () {
	const {
		permissionKey: {
			list
		}
	} = this.list('Permission').options
	return ['_id', ...list];
};

Keystone.prototype.reservedPermissionKeyField = function () {
	const {
		permissionKey: {
			field
		},
	} = this.list('Permission').options
	return ['_id', ...field];
};

Keystone.prototype.pickFieldPermission = function (listPermission) {
	const reservedField = this.reservedPermissionKeyList();
	if (typeof listPermission.toObject === 'function') {
		listPermission = listPermission.toObject();
	}
	return _.pickBy(listPermission, (p, field) => !_.includes(reservedField, field));
};

Keystone.prototype.pickListPermission = function (userPermission) {
	const lists = _.keys(this.lists);
	if (typeof userPermission.toObject === 'function') {
		userPermission = userPermission.toObject();
	}
	return _.pick(userPermission, lists);
};

/* Attach core functionality to Keystone.prototype */

Keystone.prototype.createItems = require('./lib/core/createItems');
Keystone.prototype.createRouter = require('./lib/core/createRouter');
Keystone.prototype.getOrphanedLists = require('./lib/core/getOrphanedLists');
Keystone.prototype.importer = importer;
Keystone.prototype.init = require('./lib/core/init');
Keystone.prototype.initDatabaseConfig = require('./lib/core/initDatabaseConfig');
Keystone.prototype.initExpressApp = require('./lib/core/initExpressApp');
Keystone.prototype.initExpressSession = require('./lib/core/initExpressSession');
Keystone.prototype.initNav = require('./lib/core/initNav');
Keystone.prototype.list = require('./lib/core/list');
Keystone.prototype.openDatabaseConnection = require('./lib/core/openDatabaseConnection');
Keystone.prototype.closeDatabaseConnection = require('./lib/core/closeDatabaseConnection');
Keystone.prototype.populateRelated = require('./lib/core/populateRelated');
Keystone.prototype.redirect = require('./lib/core/redirect');
Keystone.prototype.start = require('./lib/core/start');
Keystone.prototype.wrapHTMLError = require('./lib/core/wrapHTMLError');
Keystone.prototype.createKeystoneHash = require('./lib/core/createKeystoneHash');
/*
** Prepare all of delegated schemas and all of the initial entries
** Terry Chan
** 23/09/2019
*/
Keystone.prototype.createPermission = require('./lib/core/delegation/createPermission');
Keystone.prototype.createDelegatedAdmin = require('./lib/core/delegation/createDelegatedAdmin');
Keystone.prototype.createRole = require('./lib/core/delegation/createRole');
Keystone.prototype.createSystemIdentity = require('./lib/core/delegation/createSystemIdentity');
Keystone.prototype.createLocalization = require('./lib/core/delegation/createLocalization');
Keystone.prototype.createAccount = require('./lib/core/delegation/createAccount');
Keystone.prototype.delegatedLanguageSection = require('./lib/core/delegation/createLanguageSection');
Keystone.prototype.delegatedNavLanguageSection = require('./lib/core/delegation/createNavLanguageSection');
Keystone.prototype.createCountry = require('./lib/core/delegation/createCountry');

Keystone.prototype.createModelListItem = require('./lib/core/delegation/modelList/createModelListItem');
Keystone.prototype.createModelList = require('./lib/core/delegation/modelList/createModelList');

Keystone.prototype.addToDelegationModelList = require('./lib/core/data/addToDelegationModelList');

// Keystone.prototype.hooks = function() {};
// hooks.prototype.localization = require('./lib/core/hook/localization');

/* Deprecation / Change warnings for 0.4 */
Keystone.prototype.routes = function () {
	throw new Error('keystone.routes(fn) has been removed, use keystone.set(\'routes\', fn)');
};


/**
 * The exports object is an instance of Keystone.
 */
var keystone = module.exports = new Keystone();

/*
	Note: until #1777 is complete, the order of execution here with the requires
	(specifically, they happen _after_ the module.exports above) is really
	important. As soon as the circular dependencies are sorted out to get their
	keystone instance from a closure or reference on {this} we can move these
	bindings into the Keystone constructor.
*/

// Expose modules and Classes
keystone.Admin = {
	Server: require('./admin/server'),
};
keystone.Email = require('./lib/email');
keystone.Field = require('./fields/types/Type');
keystone.Field.Types = require('./lib/fieldTypes');
keystone.Keystone = Keystone;
keystone.Options = require('./lib/options')(keystone);
keystone.List = require('./lib/list')(keystone);
keystone.Storage = require('./lib/storage');
keystone.View = require('./lib/view');

/*
** Store all of reversed collections
** Terry Chan
** 24/09/2019
*/
const reservedCollectionName = [
	// reserved collection name
	'role',
	'user',
	'locale',
	'systemIdentity',
	'permission',
	'permissionListField',
	'applicationLanguage',
	'navigationLanguage',
	'modelList',
	'modelListItem',
];
if (keystone.get('advanced country model')) {
	reservedCollectionName = [
		...reservedCollectionName,
		'country',
	];
}
keystone.reservedCollectionName = reservedCollectionName;

// Customized Plugins
keystone.Plugins = {
	ImageCompressor: require('./plugins/utils/image/base64Resize'),
};

keystone.content = require('./lib/content');
keystone.security = {
	csrf: require('./lib/security/csrf'),
};
keystone.utils = utils;

/**
 * returns all .js modules (recursively) in the path specified, relative
 * to the module root (where the keystone project is being consumed from).
 *
 * ####Example:
 *     var models = keystone.import('models');
 */

Keystone.prototype.import = function (dirname) {
	return importer(this.get('module root'))(dirname);
};


/**
 * Applies Application updates
 */

Keystone.prototype.applyUpdates = function (callback) {
	var self = this;
	self.callHook('pre:updates', function (err) {
		if (err) return callback(err);
		require('./lib/updates').apply(function (err) {
			if (err) return callback(err);
			self.callHook('post:updates', callback);
		});
	});
};


/**
 * Logs a configuration error to the console
 */

Keystone.prototype.console = {};
Keystone.prototype.console.err = function (type, msg) {
	if (keystone.get('logger')) {
		var dashes = '\n------------------------------------------------\n';
		console.log(dashes + 'KeystoneJS: ' + type + ':\n\n' + msg + dashes);
	}
};

/**
 * Keystone version
 */

keystone.version = require('./package.json').version;


// Expose Modules
keystone.session = require('./lib/session');

/*
** [Improvement]
** Bundle the Field Types Components React Code to here,
** when the library is starting from the client project 
** Prevent bundle the file and response output the bundle file on every time serves in the static router
** Terry Chan
** 02/10/2019
*/
// AdminUI
// require('./admin/server/app/v2/createStaticClient').createStaticClient(keystone);
// require('./admin/server/app/v2/createStaticFieldTypes')(keystone);