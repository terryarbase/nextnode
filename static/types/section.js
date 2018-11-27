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
			field: {
				value: 'field',
				label: 'Form Field Label',
				key: 'select_option_field',
			},
			label: {
				value: 'field',
				label: 'Form Field Label',
				key: 'select_option_label',
			},
			placeholder: {
				value: 'placeholder',
				label: 'Form Placeholder',
				key: 'select_option_placeholder',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true });
	}
} 

module.exports = nextnode => new Section(nextnode);
