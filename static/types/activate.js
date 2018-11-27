const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Activate Use
** Terry Chan
** 27/11/2018
*/
class Activate extends ImmutableType {
	constructor(node) {
		const type = Map({
			active: {
				value: true,
				label: 'Activated',
				key: 'select_option_active',
			},
			inactive: {
				value: false,
				label: 'Inactive',
				key: 'select_option_inactive',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true, isBoolean: true });
	}
}

module.exports = nextnode => new Activate(nextnode);
