/**
 * Returns an Express Router with bindings for the Admin UI static resources,
 * i.e files, less and browserified scripts.
 *
 * Should be included before other middleware (e.g. session management,
 * logging, etc) for reduced overhead.
 */

var browserify = require('../middleware/browserify');
var express = require('express');
var fs = require('fs');
var less = require('less-middleware');
var path = require('path');
const _ = require('lodash');
var str = require('string-to-stream');

function buildFieldTypesStream (fieldTypes) {
	var src = '';
	var types = Object.keys(fieldTypes);
	['Column', 'Field', 'Filter'].forEach(function (i) {
		src += 'exports.' + i + 's = {\n';
		types.forEach(function (type) {
			if (typeof fieldTypes[type] !== 'string') return;
			src += type + ': require("../../fields/types/' + _.toLower(type) + '/' + fieldTypes[type] + i + '"),\n';
		});
		// Append ID and Unrecognised column types
		if (i === 'Column') {
			src += 'id: require("../../fields/components/columns/IdColumn"),\n';
			src += '__unrecognised__: require("../../fields/components/columns/InvalidColumn"),\n';
		}

		src += '};\n';
	});
	return str(src);
}



module.exports = function createStaticRouter (keystone) {
	var keystoneHash = keystone.createKeystoneHash();
	var writeToDisk = keystone.get('cache admin bundles');
	var router = express.Router();
	const delegatedAdminBrowserify = browserify({
		file: './App/index.js',
		hash: keystoneHash,
		writeToDisk: writeToDisk,
	});
	const delegatedSiginBrowserify = browserify({
		file: './Signin/index.js',
		hash: keystoneHash,
		writeToDisk: writeToDisk,
	});
	/* Prepare browserify bundles */
	var bundles = {
		fields: browserify({
			stream: buildFieldTypesStream(keystone.fieldTypes),
			expose: 'FieldTypes',
			file: './FieldTypes.js',
			hash: keystoneHash,
			writeToDisk: writeToDisk,
		}),
	};

	/*
	** Customized client's signin bundle
	** Terry Chan
	** 15/02/2019
	*/
	if (keystone.get('customized signin')) {
		const { file, out } = keystone.get('customized signin');
		if (file) {
			bundles = {
				...bundles,
				signin: browserify({
					file,
					out,
					hash: keystoneHash,
					writeToDisk: writeToDisk,
				}),
			};
		} else {
			bundles = {
				...bundles,
				signin: delegatedSiginBrowserify,
			}
		}
	} else {
		bundles = {
			...bundles,
			signin: delegatedSiginBrowserify,
		}
	}
	/*
	** Customized client's admin bundle
	** Terry Chan
	** 15/02/2019
	*/
	if (keystone.get('customized admin')) {
		const { file, out } = keystone.get('customized admin');
		if (file) {
			bundles = {
				...bundles,
				admin: browserify({
					file,
					out,
					hash: keystoneHash,
					writeToDisk: writeToDisk,
				}),
			};
		} else {
			bundles = {
				...bundles,
				admin: delegatedAdminBrowserify,
			}
		}
	} else {
		bundles = {
			...bundles,
			admin: delegatedAdminBrowserify,
		}
	}

	// service worker part
	const serviceWorker = keystone.get('service worker js');
	if (serviceWorker) {
		bundles = {
			...bundles,
			serviceWorker: browserify({
				file: serviceWorker,
				hash: keystoneHash,
				writeToDisk: writeToDisk,
			}),
		}
	}
	// console.log(bundles);
	// prebuild static resources on the next tick in keystone dev mode; this
	// improves first-request performance but delays server start
	if (process.env.KEYSTONE_DEV === 'true' || process.env.KEYSTONE_PREBUILD_ADMIN === 'true') {
		bundles.fields.build();
		bundles.signin.build();
		bundles.admin.build();
		if (serviceWorker) {
			bundles.serviceWorker.build();
		}
		// bundles.login.build();
	}

	/* Prepare LESS options */
	var elementalPath = path.join(path.dirname(require.resolve('elemental')), '..');
	var reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');
	var customStylesPath = keystone.getPath('adminui custom styles') || '';

	var lessOptions = {
		render: {
			modifyVars: {
				elementalPath: JSON.stringify(elementalPath),
				reactSelectPath: JSON.stringify(reactSelectPath),
				customStylesPath: JSON.stringify(customStylesPath),
				adminPath: JSON.stringify(keystone.get('admin path')),
			},
		},
	};

	/* Configure router */
	router.use('/styles', less(path.resolve(__dirname + '/../../public/styles'), lessOptions));
	router.use('/styles/fonts', express.static(path.resolve(__dirname + '/../../public/js/lib/tinymce/skins/keystone/fonts')));
	router.get('/js/fields.js', bundles.fields.serve);
	router.get('/js/signin.js', bundles.signin.serve);
	router.get('/js/admin.js', bundles.admin.serve);
	// router.get('/js/FieldTypes.js', path.resolve(__dirname + '../../../build/static/js/FieldTypes.js'));

	/*
	** Add support service worker file from the customized path
	** Terry Chan
	** 29/03/2019
	*/
	if (serviceWorker) {
		router.get('/js/sw.js', (req, res) => {
			res.type('text/javascript');
			const swContent = fs.readFileSync(serviceWorker, 'utf8');
			// console.log(swContent);
			res.send(swContent);
		});
	}
	// router.get('/js/login.js', bundles.login.serve);
	router.use(express.static(path.resolve(__dirname + '/../../public')));
	router.use(express.static(path.resolve(__dirname + '../../../build/static')));
	return router;
};
