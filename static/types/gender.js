const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Gender Use
** Terry Chan
** 27/11/2018
*/
class Gender extends ImmutableType {
	constructor(node) {
		const type = Map({
			female: {
				value: 'female',
				label: 'Female',
				key: 'select_option_female',
			},
			male: {
				value: 'male',
				label: 'Male',
				key: 'select_option_male',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true });
	}
} 

module.exports = nextnode => new Gender(nextnode);
