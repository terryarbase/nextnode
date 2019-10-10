/**
 * Initialises Keystone with the provided options
 */

function init (options) {
	const i18n = this.get('i18n');
	if (options.locale) {
		i18n.setLocale(options.locale);
	}
	// remove user model anyway, use delegated model list instead
	options['user model'] = 'User';
	if (options['admin path'] && !options['signin logo']) {
		options['signin logo'] = `/${options['admin path']}/images/logo.png`;
	}
	this.options(options);
	
	this.createModelListItem();
	this.createModelList();
	
	this.delegatedLanguageSection.createLanguageSection(this);
	this.delegatedNavLanguageSection.createNavLanguageSection(this);

	/*
	** [V2 Enhancement]
	** Install all of package into the client's project directory by executing the Installator process
	** e.g. clone AdminUI v2 js files, fieldtype bundle js, package.json config
	** Terry Chan
	** 08/10/2019
	*/
	if (this.get('installation')) {
		const Installator = require('./../../v2/installation/installator');
		new Installator(this).execute();
	}

	/*
	** [V2 Enhancement]
	** Prepare all of essential components for the stage V2
	** e.g. server delegated models, middlewares
	** Terry Chan
	** 09/10/2019
	*/
	if (this.get('stage') === 2) {
		const NextnodeV2 = require('./../../v2/server');
		// store all of section of stage v2 (models, middleware)
		this.set('nextnode v2', NextnodeV2);
	}


	return this;
}

module.exports = init;
