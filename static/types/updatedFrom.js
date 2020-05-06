const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Track Information for update from options
** Terry Chan
** 03/10/2019
*/
class UpdatedFrom extends ImmutableType {
	constructor(node) {
		const type = Map({
			cms: {
				value: 'cms',
				label: 'CMS',
				key: 'select_option_fromcms',
			},
			api: {
				value: 'api',
				label: 'API',
				key: 'select_option_fromapi',
			},
			website: {
				value: 'website',
				label: 'Web',
				key: 'select_option_fromwebsite',
			},
			mobileApp: {
				value: 'mobileApp',
				label: 'Mobile Application',
				key: 'select_option_frommobileapp',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true });
	}
} 

module.exports = nextnode => new UpdatedFrom(nextnode);
