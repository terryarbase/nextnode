const _           			= require('lodash');

const getConfig = (req, res) => {
	const keystone = req.keystone;
	const UserList = keystone.list(keystone.get('user model'));

	let locals = {};
	if (!req.user) {
		locals = {
			adminPath: '/' + keystone.get('admin path'),
			brand: keystone.get('brand'),
			// csrf: {
			// 	header: {
			// 		[keystone.security.csrf.CSRF_HEADER_KEY]: keystone.security.csrf.getToken(req, res),
			// 	},
			// },
			logo: keystone.get('signin logo'),
			redirect: keystone.get('signin redirect'),
			user: req.user ? {
				id: req.user.id,
				name: UserList.getDocumentName(req.user) || '(no name)',
			} : undefined,
			userCanAccessKeystone: !!(req.user && req.user.canAccessKeystone),
		};

		return res.json({
			config: locals,
		});
	}

	const lists = {};
	_.forEach(keystone.lists, function (list, key) {
		lists[key] = list.getOptions();
	});
	

	const backUrl = keystone.get('back url');
	if (backUrl) {
		// backUrl can be falsy, to disable the link altogether
		// but if it's undefined, default it to "/"
		backUrl = keystone.get('front url') || '/';
	}
	if (keystone.get('rbac') && req.user) {
		// console.log(keystone.get('nav'));
		const newNav = keystone.mergeNavOptionWithReservedCollections();
		keystone.nav = keystone.initNav(newNav, req.roleList);
		Object.keys(lists).forEach(key => {
			const listKey = lists[key].key;
			if (req.roleList[listKey]) {
				switch (req.roleList[listKey]) {
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
	const orphanedLists = [];
	if (req.user) {
		keystone.getOrphanedLists(req.roleList).map(function (list) {
			return _.pick(list, ['key', 'label', 'path']);
		});
	}
	const keystoneData = {
		adminPath: '/' + keystone.get('admin path'),
		appversion: keystone.get('appversion'),
		logo: keystone.get('signin logo'),
		backUrl: backUrl || keystone.get('frontendUrl'),
		brand: keystone.get('brand'),
		// csrf: {
		// 	header: {
		// 		[keystone.security.csrf.CSRF_HEADER_KEY]: keystone.security.csrf.getToken(req, res),
		// 	},
		// },
		// devMode: !!process.env.KEYSTONE_DEV,
		lists,
		nav: keystone.nav,
		orphanedLists: orphanedLists,
		signoutUrl: keystone.get('signout url'),
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
		appLanguage: req.appLanguage,
		menuLanguage: req.menuLanguage,
	};

	const codemirrorPath = keystone.get('codemirror url path')
		? '/' + keystone.get('codemirror url path')
		: '/' + keystone.get('admin path') + '/js/lib/codemirror';

	locals = {
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
		userCanAccessKeystone: !!(req.user && req.user.canAccessKeystone),
		title: keystone.get('name') || 'NextNode',
	};

	if (req.user) {
		keystoneData.user = {
			...(
				_.omit(req.user, [
					'_id',
					'password',
					'lastLoginAt',
					'incorrectPassword',
					'lockedAt',
					'isAdmin',
					'delegated',
					'accountStatus',
				])
			),
			id: req.user.id,
			name: UserList.getDocumentName(req.user) || '(no name)',
			// organization: req.user.organization,
		};
		if (req.roleList) {
			keystoneData.roleKey = req.roleList.roleKey;
		}
	};
	/*
	** Localization
	*/
	if (req.locales && req.locales.localization) {
		// for adminUI data language selector
		keystoneData.localization = req.locales.localization;
		keystoneData.defaultLanguage = req.locales.defaultLanguage;
		// keystoneData.defaultUILanguage = req.locales.defaultLanguage;
		keystoneData.currentLanguage = req.locales.langd;
		keystoneData.currentUILanguage = req.locales.langf;
		// language cookie control
		keystoneData.currentUILanguageName = keystone.get('cookie frontend locale');
		keystoneData.currentLanguageName = keystone.get('cookie data locale');
		keystoneData.languageCookieOptions = keystone.get('cookie language options');
		// for adminUI layout language selector
		// keystoneData.frontLang = req.locales.localization;
	}
	// console.log(keystoneData);
	const cloudinaryConfig = keystone.get('cloudinary config');
	if (cloudinaryConfig) {
		const cloudinary = require('cloudinary');
		const cloudinaryUpload = cloudinary.uploader.direct_upload();
		keystoneData.cloudinary = {
			cloud_name: keystone.get('cloudinary config').cloud_name,
			api_key: keystone.get('cloudinary config').api_key,
			timestamp: cloudinaryUpload.hidden_fields.timestamp,
			signature: cloudinaryUpload.hidden_fields.signature,
		};
		locals.cloudinaryScript = cloudinary.cloudinary_js_config();
	};

	return res.json({
		data: locals,
	});
}

module.exports = getConfig;
