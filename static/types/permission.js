const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Role Permission Use
** Terry Chan
** 27/11/2018
*/
class Permission extends ImmutableType {
	constructor(node) {
		const type = Map({
			nopermission: {
				value: 0,
				label: 'No Permission', // default value can be overrided
				key: 'select_option_no_permission',	// map to the key in locale/[lang].json
			},
			viewonly: {
				value: 1,
				label: 'View Only', 
				key: 'select_option_view_only',
			},
			createpermission: {
				value: 2,
				label: 'General Permission (View and Create)',
				key: 'select_option_create_permission',
			},
			fullpermission: {
				value: 3,
				label: 'Full Permission (View, Create and Edit)',
				key: 'select_option_full_permission',
			},

		});
		// tell the parent to transfer the lang to multilingual if needed
		super(node);
		super.initialize({ type, isTransfer: true });
	}
}

module.exports = nextnode => new Permission(nextnode);
