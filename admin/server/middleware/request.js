const fs 	= require('fs');
const _ 	= require('lodash');
const localization = require('../../../lib/handler/staticGenerator/localization');
const appLanguage = require('../../../lib/handler/staticGenerator/appLanguage');
const navigationLanguage = require('../../../lib/handler/staticGenerator/navigationLanguage');

const getStaticLanguageFile = async (nextNode) => {
	const path = `${nextNode.get('app root')}/${nextNode.get('static lang path')}`;
	var data;
	try {
		data = JSON.parse(fs.readFileSync(path, 'utf8'));
	} catch (err) { // if the language cannnot be read, then query db
		console.log('> Cannot read the Static Language File, query languages from Database.');
		const langHandler = new localization(nextNode, nextNode.list('Locale').model);
		// export file, and get db languages, if error then ignore localization in the app
		const { data: dbLang} = await langHandler.exportLanguageStatic();
		data = dbLang;
	}
	return data;
};

const getStaticNavLanguageSectionFile = async (nextNode) => {
	const path = `${nextNode.get('app root')}/${nextNode.get('static navigation path')}`;
	var data;
	try {
		data = JSON.parse(fs.readFileSync(path, 'utf8'));
	} catch (err) { // if the language cannnot be read, then query db
		console.log('> Cannot read the Static Navigation Language Section File, query navigation language sections from Database.');
		const navLangHandler = new navigationLanguage(nextNode, nextNode.list('NavigationLanguage').model);
		// export file, and get db languages, if error then ignore localization in the app
		const { data: dbLang} = await navLangHandler.exportNavSectionStatic();
		data = dbLang;
	}
	// console.log(data);
	return data;
};

const getStaticAppLanguageSectionFile = async (nextNode) => {
	const path = `${nextNode.get('app root')}/${nextNode.get('static section path')}`;
	var data;
	try {
		data = JSON.parse(fs.readFileSync(path, 'utf8'));
	} catch (err) { // if the language cannnot be read, then query db
		console.log('> Cannot read the Static App Language Section File, query app language sections from Database.');
		const appLangHandler = new appLanguage(nextNode, nextNode.list('ApplicationLanguage').model);
		// export file, and get db languages, if error then ignore localization in the app
		const { data: dbLang} = await appLangHandler.exportSectionStatic();
		data = dbLang;
	}
	// console.log(data);
	return data;
};

const getCurrentLanguage = (nextNode, req, res) => {
	const dataCookieName = nextNode.get('cookie data locale');
	const frontendCookieName = nextNode.get('cookie frontend locale');
	const currentLang = nextNode.get('locale');
	const cookieOpts = nextNode.get('cookie language options');;
	// is it valid lang in supporting language pack
	const getValidSupports = lang => {
		if (nextNode.get('support locales').indexOf(lang) === -1){
			return currentLang;
		}
		return lang;
	};

	var dataCookie = req.cookies[dataCookieName];
	var frontendCookie = req.cookies[frontendCookieName];
	// set data cookie if not exists
	if (!dataCookie) {
		res.cookie(dataCookieName, currentLang, cookieOpts);
		dataCookie = currentLang;
	}
	// set frontend layout language if not exists
	if (!frontendCookie) {
		res.cookie(frontendCookieName, currentLang, cookieOpts);
		frontendCookie = currentLang;
	}
	return {
		dataCookie: getValidSupports(dataCookie),
		frontendCookie: getValidSupports(frontendCookie),
	}
};

module.exports = async function (req, res, next, nextNode) {
	req.keystone = nextNode;

	if (nextNode.get('localization')) {
		const localization = await getStaticLanguageFile(nextNode);
		var defaultLanguage = _.find(localization, lang => lang.delegated).value;
		// get cookies language for data and frontend
		const { dataCookie, frontendCookie } = getCurrentLanguage(nextNode, req, res);
		// special for translation of server-side language
		req.t = nextNode.get('i18n');
		req.t.setLocale(frontendCookie);
		req.locales = {
			// localization language set
			localization,
			// default language to pickup the data
			defaultLanguage,
			// adminUI current data language, serve the any requested lang first before cookie lang
			langd: dataCookie,
			// req.headers.langd || req.query.langd || req.body.langd || dataCookie || defaultLanguage,
			// adminUI current layout language
			langf: frontendCookie,
		};
	}
	req.appLanguage = await getStaticAppLanguageSectionFile(nextNode);
	req.menu = await getStaticNavLanguageSectionFile(nextNode);

	// console.log(req.menu, req.appLanguage);
	next();
};
