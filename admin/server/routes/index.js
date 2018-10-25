var _ = require('lodash');
var ejs = require('ejs');
var path = require('path');

var templatePath = path.resolve(__dirname, '../templates/index.html');

module.exports = function IndexRoute (req, res) {
	var keystone = req.keystone;
	var lists = {};
	_.forEach(keystone.lists, function (list, key) {
		lists[key] = list.getOptions();
	});

	var UserList = keystone.list(keystone.get('user model'));

	var backUrl = keystone.get('back url');
	if (backUrl) {
		// backUrl can be falsy, to disable the link altogether
		// but if it's undefined, default it to "/"
		backUrl = keystone.get('front url') || '/';
	}

	if (keystone.get('rbac')) {
		keystone.nav = keystone.initNav(keystone.get('nav'), req.user.role);
		Object.keys(lists).forEach(key => {
			const listKey = lists[key].key;
			if (req.user.role[listKey]) {
				switch (req.user.role[listKey]) {
					// view-only
					case 1: {
						lists[key].noedit = true;
						lists[key].nocreate = true;
						lists[key].nodelete = true;
						break;
					}
					// no permission
					case 0: {
						// User list is used in admin client and cannot be deleted
						if (listKey === UserList.key) {
							lists[key].hidden = true;
						} else {
							delete lists[key];
						}
					}
				}
			}
		});
	}

	/**
	 * orphanedLists depends on keystone.nav. call it after rbac config
	 */
	var orphanedLists = keystone.getOrphanedLists(req.user.role).map(function (list) {
		return _.pick(list, ['key', 'label', 'path']);
	});
	var keystoneData = {
		adminPath: '/' + keystone.get('admin path'),
		appversion: keystone.get('appversion'),
		logo: keystone.get('signin logo'),
		backUrl: backUrl || keystone.get('frontendUrl'),
		brand: keystone.get('brand'),
		csrf: { header: {} },
		devMode: !!process.env.KEYSTONE_DEV,
		lists: lists,
		nav: keystone.nav,
		orphanedLists: orphanedLists,
		signoutUrl: keystone.get('signout url'),
		user: {
			id: req.user.id,
			name: UserList.getDocumentName(req.user) || '(no name)',
		},
		style: {
			nav: keystone.get('nav style'),
		},
		userList: UserList.key,
		version: keystone.version,
		wysiwyg: { options: {
			enableImages: keystone.get('wysiwyg images') ? true : false,
			enableCloudinaryUploads: keystone.get('wysiwyg cloudinary images') ? true : false,
			enableS3Uploads: keystone.get('wysiwyg s3 images') ? true : false,
			additionalButtons: keystone.get('wysiwyg additional buttons') || '',
			additionalPlugins: keystone.get('wysiwyg additional plugins') || '',
			additionalOptions: keystone.get('wysiwyg additional options') || {},
			overrideToolbar: keystone.get('wysiwyg override toolbar'),
			skin: keystone.get('wysiwyg skin') || 'keystone',
			menubar: keystone.get('wysiwyg menubar'),
			importcss: keystone.get('wysiwyg importcss') || '',
		} },
	};
	keystoneData.csrf.header[keystone.security.csrf.CSRF_HEADER_KEY] = keystone.security.csrf.getToken(req, res);

	var codemirrorPath = keystone.get('codemirror url path')
		? '/' + keystone.get('codemirror url path')
		: '/' + keystone.get('admin path') + '/js/lib/codemirror';

	var locals = {
		adminPath: keystoneData.adminPath,
		cloudinaryScript: false,
		codemirrorPath: codemirrorPath,
		env: keystone.get('env'),
		fieldTypes: keystone.fieldTypes,
		ga: {
			property: keystone.get('ga property'),
			domain: keystone.get('ga domain'),
		},
		keystone: keystoneData,
		title: keystone.get('name') || 'Keystone',
	};

	var cloudinaryConfig = keystone.get('cloudinary config');
	if (cloudinaryConfig) {
		var cloudinary = require('cloudinary');
		var cloudinaryUpload = cloudinary.uploader.direct_upload();
		keystoneData.cloudinary = {
			cloud_name: keystone.get('cloudinary config').cloud_name,
			api_key: keystone.get('cloudinary config').api_key,
			timestamp: cloudinaryUpload.hidden_fields.timestamp,
			signature: cloudinaryUpload.hidden_fields.signature,
		};
		locals.cloudinaryScript = cloudinary.cloudinary_js_config();
	};

	ejs.renderFile(templatePath, locals, { delimiter: '%' }, function (err, str) {
		res.setHeader("x-ua-compatible", "ie=edge");
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
		res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
		res.setHeader("Expires", "0"); // Proxies.
		if (err) {
			console.error('Could not render Admin UI Index Template:', err);
			return res.status(500).send(keystone.wrapHTMLError('Error Rendering Admin UI', err.message));
		}
		res.send(str);
	});
};
