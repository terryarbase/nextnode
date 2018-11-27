/**
 * Initialises Keystone with the provided options
 */

function init (options) {
	const i18n = this.get('i18n');
	if (options.locale) {
		i18n.setLocale(options.locale);
	}
	// remove user model anyway, use delegated instead
	// if (options['user model']) {
	// 	delete options['user model'];
	// }
	options['user model'] = 'User';
	this.options(options);

	/*
	** Delegated Types.Select options
	** Support Multilingual Value
	** Terry Chan
	** 27/11/2018
	*/
	this.Options.permission = require('./../../static/types/permission')(this).fullSet;
	this.Options.section = require('./../../static/types/section')(this).fullSet;
	this.Options.gender = require('./../../static/types/gender')(this).fullSet;
	this.Options.appellation = require('./../../static/types/appellation')(this).fullSet;
	this.Options.activate = require('./../../static/types/activate')(this).fullSet;
	this.Options.status = require('./../../static/types/status')(this).fullSet;
	this.Options.question = require('./../../static/types/question')(this).fullSet;
	// for customized language pack mapping for User
	this.Options.customized = require('./../../static/types/customized');

	// console.log(this.Options);
	return this;
}

module.exports = init;
