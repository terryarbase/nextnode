/*
 *  @file       section.js
 *  @author     Terry Chan
 *  @date       26-11-2018
 *
 *  @description
 *  Section list for locaization
 */
const _ = require('lodash');
const { Map, Seq } = require('immutable');

// const SectionTypes = Map({
// 	en: {
// 		value: 'en',
// 		label: 'English (US)',
// 	},
// });

class ImmutableType {
	constructor(node) {
		this._node = node;
		this._type = {};
	}

	get sectionTypes() {
		return this._type;
	}

	// immutable type
	get iSectionTypes() {
		return Map(this._type);
	}

	get values() {
		return this.getSectionValues();
	}

	get fullSet() {
		var set = {
			options: this.sectionTypes,
			immutable: this.iSectionTypes,
			values: this.getSectionValues(),
			keys: this.getSections(),
			boolean: this._isBoolean,
		};
		if (_.keys(this._customized).length) {
			set = {
				...set,
				...{
					language: this.customized,
					isCustomized: true,
				},
			};
		}
		return set; 
	}

	initialize(options={}) {
		const { isTransfer, type = Map({}), languagePack = {}, isBoolean } = options;
		// customized language pack for mapping
		this._languagePack = languagePack;
		this._isBoolean = isBoolean;
		const isLocaization = this._node.get('localization');
		if (isLocaization && isTransfer) {
			this._type = this.configuration(type);
		} else {
			this._type = type.toJS();
		}
		// console.log(this._type);
	}

	configuration(type) {
		// const types = type.toJS();
		const i18n = this._node.get('i18n');
		const supporting = this._node.get('support locales');
		// set up full support language no matter which is selected with user
		const seq = Seq(type);
		return seq.map(v => {
			v.label = _.reduce(supporting, (a, lang) => {
				if (typeof v.label !== 'object') {
					i18n.setLocale(lang);
					/*
					** Rule: customized language pack is first priority for mapping
					** Terry Chan
					** 27/11/2018
					*/
					if (this._languagePack[lang]) {
						a = {
							...a,
							...{
								[lang]: v.key ? this._languagePack[lang][v.key] : v.label,
							},
						}
					} else {
						a = {
							...a,
							...{
								[lang]: `${__(v.key) || v.label}`,
							},
						}
					}
				} else {
					a = v.label;
				}
				return a;
			}, {});
			delete v.key;
			return v;
		}).toObject();
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
