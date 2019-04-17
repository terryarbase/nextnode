const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Cloud Messaging Use
** Terry Chan
** 30/03/2019
*/
class CloudMessageState extends ImmutableType {
    constructor(node) {
        const type = Map({
            publishing: {
                value: 'publishing',
                label: 'Publishing',
                key: 'select_option_publishing',
            },
            sent: {
                value: 'sent',
                label: 'Sent',
                key: 'select_option_sent',
            },
            failed: {
                value: 'failed',
                label: 'Failed',
                key: 'select_option_failed',
            },
        });
        super(node);
        super.initialize({ type, isTransfer: true });
    }
} 

module.exports = nextnode => new CloudMessageState(nextnode);

