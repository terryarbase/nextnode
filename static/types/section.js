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

const ImmutableType = require('./ImmutableType');

class Sections extends ImmutableType {
	constructor() {
		const type = Map({
			field: {
				value: 'field',
				label: 'Form Field Label',
			},
			label: {
				value: 'field',
				label: 'Form Field Label',
			},
		});
		super(type);
	}
} 

module.exports = new Sections();
