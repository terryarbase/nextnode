const fs 	= require('fs');
const _ 	= require('lodash');
const localization = require('../../../lib/handler/localization');

const getStaticLanguageFile = async (nextNode) => {
	const path = `${nextNode.get('app root')}/${nextNode.get('static lang path')}`;
	var data;
	try {
		data = JSON.parse(fs.readFileSync(path, 'utf8'));
	} catch (err) { // if the language cannnot be read, then query db
		console.log('> Cannot red the Static Language File, query languages from Database.');
		const langHandler = new localization(nextNode, nextNode.list('Localization').model);
		// export file, and get db languages, if error then ignore localization in the app
		const { data: dbLang} = await langHandler.exportLanguageStatic();
		data = dbLang;
	}
	return data;
};

module.exports = async function (req, res, next, nextNode) {
	req.keystone = nextNode;
	if (nextNode.get('localization')) {
		// if (!req.headers.langf) {
		// 	return res.status(404).json({ error: 'invalid list path' });
		// }
		const localization = await getStaticLanguageFile(nextNode);
		const defaultLanguage = _.find(localization, lang => lang.delegated).value;
		req.locales = {
			// localization language set
			localization,
			// default language to pickup the data
			defaultLanguage,
			// adminUI current language
			langd: req.headers.langd || defaultLanguage.value,
		};
		// req.localization = await getStaticLanguageFile(nextNode);
		// req.defaultLanguage = _.find(req.localization, lang => lang.delegated);
	}
	next();
};
