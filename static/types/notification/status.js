const { Map } = require('immutable');
const ImmutableType = require('../');
/*
** The common options list for Types.Select
** Notification Status Use
** Terry Chan
** 27/11/2018
*/
class NotificationStatus extends ImmutableType {
	constructor(node) {
		const type = Map({
			pending: {
				value: 'pending',
				label: 'Pending',
				key: 'select_option_pending',
			},
			processing: {
				value: 'processing',
				label: 'Processing',
				key: 'select_option_processing',
			},
			completed: {
				value: 'completed',
				label: 'Completed',
				key: 'select_option_completed',
			},
			incompleted: {
				value: 'incompleted',
				label: 'Incompleted',
				key: 'select_option_incompleted',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true });
	}
} 

module.exports = nextnode => new NotificationStatus(nextnode);
