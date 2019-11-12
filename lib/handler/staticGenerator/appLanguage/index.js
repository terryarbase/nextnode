const _			= require('lodash');

const StaticGenerator = require('./../');

class LanguageSection extends StaticGenerator {

	constructor(nextNode, model) {
        const staticFilePath = `${nextNode.get('app root')}/${nextNode.get('static section path')}`;
        super(nextNode, staticFilePath);

        this.model = model;
        this.sections = nextNode.Options.section.keys;
        this.isMultilingual = nextNode.get('localization');
        // binding self member
        const funcs = ['exportSectionStatic'];
        _.forEach(funcs, func =>  this[func] = this[func].bind(this))
    }

	async getAllSections () {
		return await this.model.find();
	}

	// convert to pair object instead of array
	getFormatted(sections) {
		if (this.sections.length) {
			return _.reduce(sections, (a, section) => {
				// console.log(section);
				_.forEach(this.sections, key => {
					if (section[key]) {
						if (this.isMultilingual) {
							a = _.fromPairs(
								_.keys(section[key]).map(lang => {
									return [lang, {
										...a[lang],
										[`table_${section.listName}`]: section.listLabel[lang],
										..._.chain(section[key][lang])
											.keyBy(s => `${section.listName}-${s.key}`)
											.mapValues('value')
											.value()
									}];
								})
							);
						} else if (_.isArray(section[key])) {
							a = {
								...a,
								[`table_${section.listName}`]: section.listLabel,
								..._.chain(section[key])
									.keyBy(s => `${section.listName}-${s.key}`)
									.mapValues('value')
									.value()
							};
						}
					}
				});
				return a;
			}, {});
		}
		return sections;
	}

	async exportSectionStatic () {
		var sections = [];
		var error;
		// get current language supported from db
		try {
			sections = await this.getAllSections();
		} catch (err) {
			error = err;
		}

		if (error || !sections.length) {
			return {
				load: false,
				error,
			}
		}
		
		// write out the static file for later requests
		return this.exportStatic(this.getFormatted(sections));	
	}
}

module.exports = LanguageSection;
