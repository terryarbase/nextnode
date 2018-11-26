/*
 *  @file       section.js
 *  @author     Terry Chan
 *  @date       26-11-2018
 *
 *  @description
 *  Section list for locaization
 */
const _ = require('lodash');
const { Map } = require('immutable');

// const SectionTypes = Map({
// 	en: {
// 		value: 'en',
// 		label: 'English (US)',
// 	},
// });

class ImmutableType {
	constructor(type) {
		this._type = type;
	}

	get sectionTypes() {
		return this._type.toJS();
	}

	getSection(section) {
		if (_.isArray(section)) {
			return this._type.getIn(section);
		}
		return this._type.get(section);
	}

	getSections() {
		return _.keys(this._type);
	}

	getSectionValues() {
		return _.values(this._type);
	}

} 

module.exports = ImmutableType;
