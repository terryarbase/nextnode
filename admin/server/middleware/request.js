const fs 	= require('fs');
const _ 	= require('lodash');
const localization = require('../../../lib/handler/staticGenerator/localization');
const appLanguage = require('../../../lib/handler/staticGenerator/appLanguage');
const navigationLanguage = require('../../../lib/handler/staticGenerator/navigationLanguage');

const getStaticLanguageFile = async (nextNode) => {
	const path = `${nextNode.get('app root')}/${nextNode.get('static lang path')}`;
	let data;
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
	let data;
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
	let data;
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

	let dataCookie = req.cookies[dataCookieName];
	let frontendCookie = req.cookies[frontendCookieName];
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

// const constructAllLanguages = async(nextNode) => {
// 	const appLanguage = await getStaticAppLanguageSectionFile(nextNode);
// 	const manuLanguage = await getStaticNavLanguageSectionFile(nextNode);
	
// }

module.exports = async function (req, res, next, nextNode) {
	req.keystone = nextNode;
	// v2
	req.nextnode = nextNode;
	// use default initial project language
	let defaultLanguage = nextNode.get('locale');
	// get all current supported language from locale.json config
	const supportLanguages = await getStaticLanguageFile(nextNode);
	// get cookie language setting, no matter it is supporting localization
	let { dataCookie, frontendCookie } = getCurrentLanguage(nextNode, req, res);

	let localization = _.pick(supportLanguages, defaultLanguage);

	req.t = nextNode.get('i18n');
	req.t.setLocale(defaultLanguage);

	// if localization is set, setup each of language pack and setLocale of i18n
	if (nextNode.get('localization')) {
		defaultLanguage = _.find(supportLanguages, lang => lang.delegated).value || localization.value;
		localization = { ...supportLanguages };
		req.t.setLocale(frontendCookie);
	}
	// check if the cookie value is valid for supporting language pick
	dataCookie = (localization[dataCookie] && localization[dataCookie].value) 
		|| localization[defaultLanguage].value;
	frontendCookie = (localization[frontendCookie] && localization[frontendCookie].value) 
		|| localization[defaultLanguage].value;


	/*
	** Use system user prefer language first
	** Terry Chan
	** 08/10/2019
	*/
	const preferLanguage = req.user && req.user.language;
	const contentLanguage = req.user && req.user.language;
	req.locales = {
		// localization language set
		localization,
		// default language to pickup the data
		defaultLanguage,
		// adminUI current data language, serve the any requested lang first before cookie lang
		langd: contentLanguage || req.headers.langd || req.query.langd || req.body.langd || dataCookie,
		// adminUI current layout language
		langf: preferLanguage,
	};
	// }

	req.appLanguage = await getStaticAppLanguageSectionFile(nextNode);
	req.menuLanguage = await getStaticNavLanguageSectionFile(nextNode);

	nextNode.set('langf', req.locales.langf);
	nextNode.set('langd', req.locales.langd);
	nextNode.set('language pack', req.locales.localization);
	nextNode.set('systemUser', req.user);
	/*
	** update the user prefer language if it is being changed
	** 11/06/2019
	*/
	// if (preferLanguage !== req.locales.langf) {
	// 	req.user.set('language', req.locales.langf);
	// 	req.user.save();
	// }
	// console.log(req.menu, req.appLanguage);
	if (next) next();
};
