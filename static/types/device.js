const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Device Use
** Terry Chan
** 27/11/2018
*/
class Device extends ImmutableType {
	constructor(node) {
		const type = Map({
			ios: {
				value: 'ios',
				label: 'iOS',
				key: 'select_option_ios',
			},
			android: {
				value: 'android',
				label: 'Android',
				key: 'select_option_android',
			},
			// wos: {
			// 	value: 'window',
			// 	label: 'Window',
			// 	key: 'select_option_windowos',
			// },
		});
		super(node);
		super.initialize({ type, isTransfer: true });
	}
} 

module.exports = nextnode => new Device(nextnode);
