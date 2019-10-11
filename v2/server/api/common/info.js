const _           			= require('lodash');

const APIInterface 		= require('./../interface');

class ConfigInfoHandler extends APIInterface{
	constructor(options) {
		super(options);
		this.signinInfo = options.signinInfo;
		// main control flow self binding
        const funcs = [
            'getInfo',
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
	}

	getInfo() {
		if (!this.req.user) {
			return {
				adminPath: '/' + this.nextnode.get('admin path'),
				brand: this.nextnode.get('brand'),
				logo: this.nextnode.get('signin logo'),
				redirect: this.nextnode.get('signin redirect'),
				userCanAccessKeystone: !!(this.req.user && this.req.user.canAccessKeystone),
			};
		}

		let locals = {};
		const lists = {};
		_.forEach(this.nextnode.lists, function (list, key) {
			lists[key] = list.getOptions();
		});
		

		const backUrl = this.nextnode.get('back url');
		if (backUrl) {
			// backUrl can be falsy, to disable the link altogether
			// but if it's undefined, default it to "/"
			backUrl = this.nextnode.get('front url') || '/';
		}
		if (this.nextnode.get('rbac') && this.req.user) {
			// console.log(this.nextnode.get('nav'));
			const newNav = this.nextnode.mergeNavOptionWithReservedCollections();
			this.nextnode.nav = this.nextnode.initNav(newNav, this.req.roleList);
			Object.keys(lists).forEach(key => {
				const listKey = lists[key].key;
				if (this.req.roleList[listKey]) {
					switch (this.req.roleList[listKey]) {
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
							if (listKey === this.userList.key) {
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
		 * orphanedLists depends on this.nextnode.nav. call it after rbac config
		 */
		const orphanedLists = [];
		if (this.req.user) {
			this.nextnode.getOrphanedLists(this.req.roleList).map(function (list) {
				return _.pick(list, ['key', 'label', 'path']);
			});
		}
		const nextnodeData = {
			adminPath: '/' + this.nextnode.get('admin path'),
			appversion: this.nextnode.get('appversion'),
			logo: this.nextnode.get('signin logo'),
			backUrl: backUrl || this.nextnode.get('frontendUrl'),
			brand: this.nextnode.get('brand'),
			lists,
			nav: this.nextnode.nav,
			orphanedLists: orphanedLists,
			signoutUrl: this.nextnode.get('signout url'),
			style: {
				nav: this.nextnode.get('nav style'),
			},
			userList: this.userList.key,
			version: this.nextnode.version,
			wysiwyg: { options: {
				enableImages: this.nextnode.get('wysiwyg images') ? true : false,
				enableCloudinaryUploads: this.nextnode.get('wysiwyg cloudinary images') ? true : false,
				enableS3Uploads: this.nextnode.get('wysiwyg s3 images') ? true : false,
				additionalButtons: this.nextnode.get('wysiwyg additional buttons') || '',
				additionalPlugins: this.nextnode.get('wysiwyg additional plugins') || '',
				additionalOptions: this.nextnode.get('wysiwyg additional options') || {},
				overrideToolbar: this.nextnode.get('wysiwyg override toolbar'),
				skin: this.nextnode.get('wysiwyg skin') || 'keystone',
				menubar: this.nextnode.get('wysiwyg menubar'),
				importcss: this.nextnode.get('wysiwyg importcss') || '',
			} },
			appLanguage: this.req.appLanguage,
			menuLanguage: this.req.menuLanguage,
		};

		const codemirrorPath = this.nextnode.get('codemirror url path')
			? '/' + this.nextnode.get('codemirror url path')
			: '/' + this.nextnode.get('admin path') + '/js/lib/codemirror';

		locals = {
			adminPath: nextnodeData.adminPath,
			cloudinaryScript: false,
			codemirrorPath: codemirrorPath,
			env: this.nextnode.get('env'),
			fieldTypes: this.nextnode.fieldTypes,
			ga: {
				property: this.nextnode.get('ga property'),
				domain: this.nextnode.get('ga domain'),
			},
			keystone: nextnodeData,
			userCanAccessKeystone: !!(this.req.user && this.req.user.canAccessKeystone),
			title: this.nextnode.get('name') || 'NextNode',
		};

		if (this.req.user) {
			console.log(this.req.user);
			nextnodeData.user = {
				...(
					_.pick(this.req.user, [
						'name',
						'email',
						'lastLoginAt',
						'language',
						'contentLanguage',
					])
				),
				...(
					_.pick(this.signinInfo, [
						'sessionToken',
						'refreshToken',
					])
				),
				id: this.req.user._id,
			};
			if (this.req.roleList) {
				nextnodeData.roleKey = this.req.roleList.roleKey;
			}
		};
		/*
		** Localization
		*/
		if (this.req.locales && this.req.locales.localization) {
			// for adminUI data language selector
			nextnodeData.localization = this.req.locales.localization;
			nextnodeData.defaultLanguage = this.req.locales.defaultLanguage;
			// nextnodeData.defaultUILanguage = this.req.locales.defaultLanguage;
			nextnodeData.currentLanguage = this.req.locales.langd;
			nextnodeData.currentUILanguage = this.req.locales.langf;
			// language cookie control
			nextnodeData.currentUILanguageName = this.nextnode.get('cookie frontend locale');
			nextnodeData.currentLanguageName = this.nextnode.get('cookie data locale');
			nextnodeData.languageCookieOptions = this.nextnode.get('cookie language options');
			// for adminUI layout language selector
			// nextnodeData.frontLang = this.req.locales.localization;
		}
		// console.log(nextnodeData);
		const cloudinaryConfig = this.nextnode.get('cloudinary config');
		if (cloudinaryConfig) {
			const cloudinary = require('cloudinary');
			const cloudinaryUpload = cloudinary.uploader.direct_upload();
			nextnodeData.cloudinary = {
				cloud_name: this.nextnode.get('cloudinary config').cloud_name,
				api_key: this.nextnode.get('cloudinary config').api_key,
				timestamp: cloudinaryUpload.hidden_fields.timestamp,
				signature: cloudinaryUpload.hidden_fields.signature,
			};
			locals.cloudinaryScript = cloudinary.cloudinary_js_config();
		};

		return locals;
	}

	execute() {
		const data = this.getInfo();
		return this.res.json({
			data,
		});
	}	
}

module.exports = ConfigInfoHandler;
