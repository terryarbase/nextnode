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
		lists,
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
		frontLang: {
			en: {
				value: 'en',
				label: 'English',
				icon: 'iVBORw0KGgoAAAANSUhEUgAAAEYAAAAvCAYAAABe1bwWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMjZGOUU0NjA1RUQxMUUzOTkwODgwRUU1QTkwOENFMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNkZCQjA0NDA1RUQxMUUzOTkwODgwRUU1QTkwOENFMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUyNkY5RTQ0MDVFRDExRTM5OTA4ODBFRTVBOTA4Q0UwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUyNkY5RTQ1MDVFRDExRTM5OTA4ODBFRTVBOTA4Q0UwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+CEwDDQAAAsdJREFUeNrsm0toE0EYx/9Zt3HzKLY2tqZNsbRordaDYLVVVBAp0oP2UOzF6E0LngQPHrx48FAEwYOPIAhalVIvKqJVER+hUEERVBTaXNRgjUmqbRrT5uk3yTY1RMgmEEh25w9/ZrM7MzA/vv3mkUTXM+jCP9pHPkbuJNeRdSiSht4MogSUIHvI42QHeXTxgSCXEnmY/IjcS15dTCglJJ081l557IyBgT0Q5QpXyf3gYgwiZDuLmG7yIc4kLcaiW5BzClemBhiYXZxDlroYGEshLeurK3Cmz6pWMLVCoS13tJqwpdmYBKRCCQWD6Wg2JcvdbWZVhkxBYColAW0NUvJ6z8ZKVYIRC2nUudYEQbeUazY1GvDhWyivPqQbF9UVMbaaCth3rsy4d6KnFq1WSTsRM7DXghqzCONyIf0KNa3SY5mQuVuoWyHivL0BoXAcsTgQilAZS8A7G8Wp4e/qAxOOJrB9nUlxZwZ9CqCZAEYIzLUXfnUmXzYwxzMf4on8Og3Mx3F6ZApjE0H1zkr3387g7N0fiMaU0fEFojh5y42PeSbjsky+45NBXHdOK+rw3IOfcPsj2lnHOD/P5awzR69QuUdK/tO1gmMrvaiDKKjjfEvxAm99vaQIzAabhPdfc0fN/OHj6gDTblsC8ysYw+2xabg8C1hj0aO/qxrWqtRmsqPFqAiMaiKmvTF5FIrXriAujHox8yeW/DwxtYCXlH8YnL6tVdjcZKS7fu2AYYu2S0+9ePhuFon/LASHaNZ6/imAbS0mbeWYI5e/5KzDpmm3/7d2jx20IA6Gg+FgOJhiShcMhRMcA48YDoaD4WA4GA6GgynH3XWpn6TxiOFgOJiyB+PjGLLkZ2CcnEOWXjEwVziHLDkYmCfkm5xFWozF48Xke5Q8wpngjswiPSuxrw7Z7+j3k+8h9Y8Mrcgjj/kA+aDMAn8FGACavLL5a0IxqQAAAABJRU5ErkJggg==',
				// delegated: true, // the record must exists in
			},
			zhtw: {
				value: 'zhtw',
				label: '繁體中文',
				active: true,
				icon: 'iVBORw0KGgoAAAANSUhEUgAAAEYAAAAvCAYAAABe1bwWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowQUY5N0YwMjA1RUUxMUUzOTkwODgwRUU1QTkwOENFMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowQUY5N0YwMzA1RUUxMUUzOTkwODgwRUU1QTkwOENFMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBBRjk3RjAwMDVFRTExRTM5OTA4ODBFRTVBOTA4Q0UwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBBRjk3RjAxMDVFRTExRTM5OTA4ODBFRTVBOTA4Q0UwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+DUgLIgAAAkJJREFUeNrs2ztIW1EcBvDvBodkqM/4wtci2FKhWMQHNI7RQayTOuhqdZNC6yAidlFEZxXXUmqdnHwgKsaCqKho0FZcfFVSTRUzpCJ6/Z94DYZgmwOKief/wUeGe+4N98fNOfeGRCutGcStlFHfUYuoyVQND5gvFxN45OhUF3WO2k8dvdlgMl7N1K/UEWolNeWhUcIkmnGulca5CwOL2BBlDBigVoMjDM6pdeKKsVNr2cQfYWE3GXMKJzANAqaEHYJSLOYYq+xeWRkxiIsxo+B1KmyF6Zia3cbS2m8cn3ixvXf6FGCSomT3yH2RiPYPb6DdWrPK7dm+6rqO1k4H1jfdkQ5jMkmhPLeiqT4/ACVg7aMN7xsL8DLHGvGXTMgwmWnRaP9oQ3ys+Z/jxPZPzTakpT5TAyaW5hQtxFs+Mc4ab1EDppAmWpnkv0pRA6akOEPqwLaidDVgpr7vSB14WnJ8xMIsrhxIHXhx1aUGzPHJX7pPCW3s5aXuG68EzO4vD9q6HDj1nP0XsKVjBvsHHjVgRJw/jtDdu+C7w73rSunpncfPrT8Rf4Mn/Ujg3DhEU+skEhMsyMtN9q0+jrk9LDtdOHR7sbv/JJ6VoJXWDOqP9eZh8NXm/XyUVArDMAzD3M+qFM4TIF8xDMMwDMMwDMNhGIZhGIZhGIZhGIZhGIZRC+aIGYLiFjAOdgjKjIDpY4eg9AuYcepntvBHWIzdTL711G9sgiHDwr8qeXH9O/oK6jCu/5GhSlzGOb+lVhkWuBJgAI/vikappnmnAAAAAElFTkSuQmCC',
			},
			zhcn: {
				value: 'zhcn',
				label: '简体中文',
				icon: 'iVBORw0KGgoAAAANSUhEUgAAAEYAAAAvCAYAAABe1bwWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRTg5NzQyNzA1RUYxMUUzOTkwODgwRUU1QTkwOENFMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRTg5NzQyODA1RUYxMUUzOTkwODgwRUU1QTkwOENFMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJFODk3NDI1MDVFRjExRTM5OTA4ODBFRTVBOTA4Q0UwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJFODk3NDI2MDVFRjExRTM5OTA4ODBFRTVBOTA4Q0UwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+DnLX4gAABA1JREFUeNrsm8tPE0Ecx38zu91SqEUBeSnGFxr1YEw8oAfiI0ESE/WiXvTgwcefpPHiwYuPi0YTNTFGiUajJh7UQHwHAYsW5NHHPsff7LZrsdYuqylTmV/yIy10Z3c++3t8Z7aQ1OGTUGT96KfRe9Db0An838bQk+iP0c+h3yr8geTB1KFfQD8Ki9suoZ9Az6r5X5yXUFzjDEz04xR/9KEfk0x84yz6aL6mVM2UVRmgbTnR4ZzhqdRbVTCr027Fc5J1IoPZwcG0VONMkZ3fgDYZQDuybq/jr9m0Csa9Nq83iGWttFpnsl41Allm+AKAxE0wnzWJCIUbDQ1G2zXu3f2ggmEqAs7nev+9MxrDiIkIm0tquKMYKGtnkSsDYywW+DDSiFHyqAWYQUHdNC109Q0FRunMenCwkELEwc4fLPCM2+3Asor72n4bL43f9pwbWYXPLGguhTpoVfpn5KxOB0+n4gk7pasNZf0M+mwNRwxqEX+ADTNgv1kS/gqQj7p5CkjMBrV7FhgGIKm3gOkKWC+W1k7EKAiCxK2fA6zI/t1dxq7ELKw52ybdtCRRB9Qt0+B8jYoZMVxnkKVGXoQwIAoD2poDpXumtEPtSYKzESeTwsk4RXPOqGC9bKx4EfbQEnDWzQJd6UWixd+PxMQEo+1NerojaOhh5HCfM+EPDQABwLiG6eOmJHY6Oo/zVh2MfrMTtP4xoC16qIF5FBgDywN/3nzc7OscEcCUrTEso4B+vRPsTw3zHtR83gTG/dbfdp5yxqHw9AXNAWdSE7xdY1E07rSD/S4eHAoKOOv5snALTCzsypo0iGCV2zV2DfNhi3fBlFWU/VbQmlLUrikKRt6iXR1j5e+VTsH+2CBoxBQmnFMCrWuciRApwDwlre0eRzg2kIQJWu84QNSpEeVbZ1e++Qkr1EWYT5vcRaWfwUMJt3gLr3y5niEBwNBm3VOtGfWPC1CwSel2A4o750ude6v4GDWxJFA6irYicVK869iDeEcZAQWFmbp9wgdHcblgDybKj8VX5RYB+338l/aeAOu1d5zSlakNMIV9F95Gzbttc2oJn4z9vgEiPSmvq6DIKwsGi7fKlTMGjD1cP2dVXoDiQhquX3Aw/LlSxT206P5RD8qTZi8NygFsz7nrqN9tKWj7viC0jJdKhWI9FgP9RqeQu3iBwPyb2HQgemjEE3EcSkoD/dpKN61EtKrt+XKxyIoUrdv+LXGfAKtVPRuu0PWrXcBMAurW7yCyVS+VasyoRCDBSDASjAQjwUgwEowEI8FIMIsdzDeJocRSHMyA5FBiDziYs5JDiZ3jYO6gX5QsfOMsbheK7yn0y5IJXMmz8LsSfwzAv0d/AP0aeP+RsVgsmZ/zQfQjeRbwQ4ABACBTXQ6G9egZAAAAAElFTkSuQmCC',
			},
		},
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
		title: keystone.get('name') || 'NextNode',
	};

	/*
	** Localization
	*/
	if (req.locales && req.locales.localization) {
		keystoneData.localization = req.locales.localization;
		keystoneData.defaultLanguage = req.locales.defaultLanguage;
	}
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
