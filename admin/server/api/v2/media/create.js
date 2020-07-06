/*
** [V2 Enahancement]
** Rest API for media upload
** Terry Chan
** @UPDATED: 12/06/2020
** @CREATED: 12/06/2020
*/

/*
** Configurations:
** 'media modal name'
*/
const _ 				= require('lodash');
const BluePromise 		= require('bluebird');

module.exports = (req, res) => {
	const nextnode = req.keystone;
	if (!nextnode.security.csrf.validate(req)) {
		return res.apiError(403, req.t.__('msg_invalid_csrf'));
	}
	const mediaModalName = nextnode.get('media modal name') || 'Media';
	const list = nextnode.list(mediaModalName);
	const {
		body,
		locales,
		list: {
			options: {
				multilingual,
			},
			fields,
		},
	} = req;
	list.prepareDataPermission(req, body);
	const session = await nextnode.mongoose.startSession()
    session.startTransaction();
    try {
    	const file = _.get(req, 'files[0]');
    	const options = {
			files: req.files,
			ignoreNoEdit: true,
			user: req.user,
			__: req.t.__,
			lang: locales && locales.langd,
			isMultilingual: !!locales,
			defaultLang: locales && locales.defaultLanguage,
			supportLang: locales && locales.localization,
		};
    	const media = new list.model();
    	if (file) {
	    	// const medias = await BluePromise.map(files, async ({ _id }) => {
	        const data = {
	            source: `upload:File-upload`,
	        }
	        const insertError = await list.updateList(media, data, {
	            ignoreNoEdit: true,
	            files: {
	                'File-upload': file
	            },
	        })
	        if (insertError) {
				throw new Error(insertError);
	        }
	        // Throw error if some one insert fail
	        if (result.error.length) {
	            throw result
	        }
	        await session.commitTransaction()
	        session.endSession();
	    }
	    return res.json(list.getData(media, undefined, null, options));
    } catch (err) {
    	await session.abortTransaction();
        session.endSession();

        const status = err.error === 'validation errors' ? 400 : 500;
		const error = err.error === 'database error' ? err.detail : err;
		return res.apiError(status, err);
        // Not handle error here, pass error to parent
    }
	// const newData = req.list.prepareCorrectParam(body);
	// const item = new req.list.model();
	// const options = {
	// 	files: req.files,
	// 	ignoreNoEdit: true,
	// 	user: req.user,
	// 	__: req.t.__,
	// 	lang: locales && locales.langd,
	// 	isMultilingual: !!locales,
	// 	defaultLang: locales && locales.defaultLanguage,
	// 	supportLang: locales && locales.localization,
	// };
	// req.list.updateItem(item, newData, options, function (err) {
	// 	if (err) {
	// 		var status = err.error === 'validation errors' ? 400 : 500;
	// 		var error = err.error === 'database error' ? err.detail : err;
	// 		return res.apiError(status, err);
	// 	}
	// 	res.json(req.list.getData(item, undefined, null, options));
	// });
};

module.exports = create;
