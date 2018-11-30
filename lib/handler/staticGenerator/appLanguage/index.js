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
				_.forEach(this.sections, key => {
					if (section[key]) {
						if (this.isMultilingual) {
							a = {
								...a,
								...{
									/* convert key field value as Object Key
									** {
									**   key: 'test',
									**	 value: 'Test Value'
									** }
									** 
									** test: 'Test Value'
									*/
									[section.listName]:  {
										...a[section.listName],
										...{
											tableName: section.listName,
											[key]: _.fromPairs(
					                            _.keys(section[key])
					                            .map(
					                                k => [
					                                	k,
					                                	_.fromPairs(
					                                		_.map(section[key][k], sk => [sk.key, sk.value])
					                                	),
					                                ]
					                            )
					                        ),
										},
									}
								},
							};
						} else if (_.isArray(section[key])) {
							a = {
								...a,
								...{
									[section.listName]: {
										...a[section.listName],
										...{
											tableName: section.listName,
											[key]: _.fromPairs(
												_.map(section[key], 
													k => [
														k,
														_.fromPairs(
						                                	_.map(section[key], sk => [sk.key, sk.value])
						                                ),
													]
												)
											),
										},
									},
								},
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
