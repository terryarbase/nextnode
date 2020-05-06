const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Record Action Type
** Terry Chan
** 30/03/2019
*/
class RecordAction extends ImmutableType {
    constructor(node) {
        const type = Map({
            add: {
                value: 'add',
                label: 'Create',
                key: 'select_option_actioncreate',
            },
            update: {
                value: 'update',
                label: 'Update',
                key: 'select_option_actionupdate',
            },
            remove: {
                value: 'remove',
                label: 'Remove',
                key: 'select_option_actionremove',
            },
        });
        super(node);
        super.initialize({ type, isTransfer: true });
    }
} 

module.exports = nextnode => new RecordAction(nextnode);

