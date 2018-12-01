const _			= require('lodash');

const StaticGenerator = require('./../');

class NavigationLanguageSection extends StaticGenerator {

	constructor(nextNode, model) {
        const staticFilePath = `${nextNode.get('app root')}/${nextNode.get('static navigation path')}`;
        super(nextNode, staticFilePath);

        this.model = model;
        this.sections = nextNode.Options.section.keys;
        this.isMultilingual = nextNode.get('localization');
        // binding self member
        const funcs = ['exportNavSectionStatic'];
        _.forEach(funcs, func =>  this[func] = this[func].bind(this))
    }

	async getNaviagtionSections () {
		return await this.model.find();
	}

	// convert to pair object instead of array
	getFormatted(navigations) {
		return _.fromPairs(_.map(navigations, n => [n.navigation, n.label]), 'navigation');
	}

	async exportNavSectionStatic () {
		var navigations = [];
		var error;
		// get current language supported from db
		try {
			navigations = await this.getNaviagtionSections();
		} catch (err) {
			error = err;
		}

		if (error || !navigations.length) {
			return {
				load: false,
				error,
			}
		}
		
		// write out the static file for later requests
		return this.exportStatic(this.getFormatted(navigations));	
	}
}

module.exports = NavigationLanguageSection;
