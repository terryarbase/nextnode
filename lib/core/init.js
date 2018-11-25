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
	return this;
}

module.exports = init;
