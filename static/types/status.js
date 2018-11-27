const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Section Use
** Terry Chan
** 27/11/2018
*/
class Section extends ImmutableType {
	constructor(node) {
		const type = Map({
			enabled: {
				value: true,
				label: 'Enabled',
				key: 'select_option_enabled',
			},
			disabled: {
				value: false,
				label: 'Disabled',
				key: 'select_option_disabled',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true, isBoolean: true });
	}
} 

module.exports = nextnode => new Section(nextnode);
