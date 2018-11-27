const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Appellation Use
** Terry Chan
** 27/11/2018
*/
class Appellation extends ImmutableType {
	constructor(node) {
		const type = Map({
			mr: {
				value: 'mr',
				label: 'Mr',
				key: 'select_option_mr',
			},
			miss: {
				value: 'miss',
				label: 'Miss',
				key: 'select_option_miss',
			},
			mrs: {
				value: 'mrs',
				label: 'Mrs.',
				key: 'select_option_mrs',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true });
	}
} 

module.exports = nextnode => new Appellation(nextnode);
