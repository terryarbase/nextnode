// const keystone = require('keystone');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _find = require('lodash/find');
const _keys = require('lodash/keys');
const _map = require('lodash/map');
const _forOwn = require('lodash/forOwn');
/**
* Language Section Model
* ==========
*/

function createLanguageSectionModel () {
    const multilingual = this.get('localization');
    const SectionList = new this.List('Role', {
        track: true,
        noscale: true,
        nodelete: true,
        nocreate: true,
        nodownload: true,
        multilingual,
        isCore: true,
        searchFields: 'label',
        defaultColumns: 'label, section',
        defaultSort: '-delegated',
    });

    const nextnode = this;
	const allLists = nextnode.lists;
    const Types = this.Field.Types;
    // use customerized ordering
    
    Object.keys(allLists).forEach(function (key) {
        
    });
	SectionList.add(
        {
            name: { type: Types.Text, required: true, initial: true, index: true, min: 2 },
            delegated: { 
                type: Types.Boolean,
                noedit: true,
                hidden: true, 
            },
        },
        'Permissions',
        permissionSchema
    );

    SectionList.register();
}

module.exports = createLanguageSectionModel;
