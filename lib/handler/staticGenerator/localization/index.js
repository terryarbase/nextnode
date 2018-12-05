const _			= require('lodash');

const StaticGenerator = require('./../');

class Localization extends StaticGenerator {
	constructor(nextNode, model) {
        const staticFilePath = `${nextNode.get('app root')}/${nextNode.get('static lang path')}`;
        super(nextNode, staticFilePath);
        this.model = model;
        // binding self member
        const funcs = ['exportLanguageStatic'];
        _.forEach(funcs, func =>  this[func] = this[func].bind(this))
    }

	async getActiveLanguage () {
		return await this.model
			.find({ activate: true })
			.sort({ delegated: -1 });
	}

	getKeyData(languages) {
		return _.chain(languages)
				.map(lang => ({ 
					label: lang.language, 
					value: lang.identify, 
					delegated: lang.delegated,
					altIdentify: lang.altIdentify,
					icon: lang.icon,
				}))
				.keyBy('value')
				.value();
	}

	async exportLanguageStatic () {
		var languages = [];
		var error;
		// get current language supported from db
		try {
			languages = await this.getActiveLanguage();
		} catch (err) {
			error = err;
		}

		if (error || !languages.length) {
			return {
				load: false,
				error,
			}
		}
		// write out the static file for later requests
		return this.exportStatic(this.getKeyData(languages));
	}
}

module.exports = Localization;
