/*
 *  @file       config.js
 *  @author     Terry Chan
 *  @date       26-10-2018
 *
 *  @description
 *  Configurations list
 */
const { Map } = require('immutable');

const Configurations = Map({
	reverseModelName: [
		'Localization',
		'Role',
		'App_Update',
	];
});

module.exports = Configurations;
