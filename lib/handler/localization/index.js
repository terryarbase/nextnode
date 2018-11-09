const fs 	= require('fs');
const _			= require('lodash');

class Localization {
	constructor(nextNode, model) {
        this.node = nextNode;
        this.staticFilePath = `${nextNode.get('app root')}/${nextNode.get('static lang path')}`;
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

 	writeStatic(setting) {
		return new Promise((resolve, reject) => {
			var data = JSON.stringify(setting);
			fs.writeFile(this.staticFilePath, data, { flag: 'w' }, err => {
			    if (err) reject(err);
			    resolve();
			});
		});
	}

	getKeyData(languages) {
		return _.chain(languages)
				.map(lang => ({ 
					label: lang.language, 
					value: lang.identify, 
					delegated: lang.delegated,
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
		
		const data = this.getKeyData(languages);

		// write out the static file for later requests
		try {
			await this.writeStatic(data);
		} catch (err) {
			return {
				load: true,
				error: err,
			} 
		}
		console.log('> Finished to write the Static Language File to: ', this.staticFilePath);
		return { data };
	}
}

module.exports = Localization;
