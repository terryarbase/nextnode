// const keystone = require('keystone');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _find = require('lodash/find');
/**
* Role Model
* ==========
*/

function createRoleModel () {
    const RoleList = new this.List('Role', {
        track: true
    });

    const keystone = this;
    
	var allLists = this.lists;
    const Types = this.Field.Types;
    const permissionOptions = [{ value: 2, label: 'Editable' }, { value: 1, label: 'View Only' }, { value: 0, label: 'No Permission' }];

    const permissionSchema = {
        Role: { 
            type: Types.Select, 
            numeric: true,
            options: permissionOptions,
            default: 2,
            label: RoleList.label
        },
    };
    var roles = keystone.get('role list');
    // use customerized ordering
    if (roles) {
        Object.keys(roles).forEach(function (key) {
            if (roles[key]) {
                if (key === 'Role') {
                    const roleSchema = permissionSchema['Role'];
                    delete permissionSchema['Role'];
                    permissionSchema['Role'] = roleSchema;
                } else if (allLists[key]){
                    permissionSchema[allLists[key].key] = { 
                        type: Types.Select, 
                        numeric: true,
                        options: permissionOptions,
                        default: 0,
                        label: allLists[key].label,
                        hidden: !!allLists[key].options.hidden,
                    };
                }
            }
        });
    } else {    // by default
    	Object.keys(allLists).forEach(function (key) {
            permissionSchema[allLists[key].key] = { 
                type: Types.Select, 
                numeric: true,
                options: permissionOptions,
                default: 0,
                label: allLists[key].label,
                hidden: !!allLists[key].options.hidden,
            };
    	});
    }

	RoleList.add(
        {
            name: { type: Types.Text, required: true, index: true },
        },
        'Permissions',
        permissionSchema
    );

    RoleList.register();
}

module.exports = createRoleModel;
