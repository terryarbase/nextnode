/*
 *  @file       locales.js
 *  @author     Terry Chan
 *  @date       26-10-2018
 *
 *  @description
 *  Languages list
 */
const { Map } = require('immutable');

const Languages = Map({
	en: {
		value: 'en',
		label: 'English',
		// delegated: true, // the record must exists in
	},
	zhtw: {
		value: 'zhtw',
		label: '繁體中文',
		active: true,
	},
	zhcn: {
		value: 'zhcn',
		label: '简体中文',
	},
});

module.exports = Languages;
