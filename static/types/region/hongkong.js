const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Hong Kong Region Use
** Terry Chan
** 27/11/2018
*/
class RegionHongKong extends ImmutableType {
	constructor(node) {
		const type = Map({
			hki: {
				value: 'hki',
				label: 'Hong Kong Island',
				key: 'select_option_hkisland',
			},
			kl: {
				value: 'kl',
				label: 'Kowloon',
				key: 'select_option_kowloon',
			},
			nt: {
				value: 'nt',
				label: 'New Territories',
				key: 'select_option_newterritories',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true });
	}
} 

module.exports = nextnode => new RegionHongKong(nextnode);
