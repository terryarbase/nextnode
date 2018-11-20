/**
 * Initialises Keystone with the provided options
 */

function init (options) {
	const i18n = this.get('i18n');
	if (options.locale) {
		i18n.setLocale(options.locale);
	}
	this.options(options);
	return this;
}

module.exports = init;
