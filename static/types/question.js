const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Question Use
** Terry Chan
** 27/11/2018
*/
class Question extends ImmutableType {
	constructor(node) {
		const type = Map({
			yes: {
				value: true,
				label: 'Yes',
				key: 'select_option_yes',
			},
			no: {
				value: false,
				label: 'No',
				key: 'select_option_no',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true, isBoolean: true });
	}
} 

module.exports = nextnode => new Question(nextnode);
