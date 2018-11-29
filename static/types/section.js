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
		super(node);
		const type = Map({
			field: {
				value: 'field',
				label: 'Field Label',
				key: 'select_option_field',
			},
			note: {
				value: 'note',
				label: 'Field Remark Note',
				key: 'select_option_note',
			},
			placeholder: {
				value: 'placeholder',
				label: 'Input Placeholder',
				key: 'select_option_placeholder',
			},
		});
		super.initialize({ type, isTransfer: true });
	}
} 

module.exports = nextnode => new Section(nextnode);
