// const keystone = require('keystone');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _find = require('lodash/find');
const _keys = require('lodash/keys');
const _map = require('lodash/map');
/**
* Role Model
* ==========
*/

var delegatedRole = {
    name: 'Super Administrator',
    delegated: true,
}

const createDelegatedRole = async (node, model, permissions) => {
    const localization = node.get('localization');
    const currentLanguage = node.get('locale');
    var permission = _keys(permissions);
    if (permission.length) {
        permission = _map(permission, p => ({ [p]: 3 }));
    }
    var schema = { ...delegatedRole, ...permission };
    if (localization) {
        schema = {
            ...delegatedRole,
            ...{
                name: {
                    [currentLanguage]: delegatedRole.name,
                },
            },
        };
    }
    try {
        var newRole = await model.findOne({ delegated: true });
        if (!newRole) {
            newRole = await new model(schema).save();
            console.log('> [Account Role] Create a delegated account administrator role: ', newRole);
        } else {
            console.log('> [Account Role] Delegated account administrator role, and no need to create');
        }
    } catch (err) {
        console.log('> [Account Role] Cannot create a delegated account role.');
        console.log(err);
        process.exit(1);
    }
};

function createRoleModel () {
    const multilingual = this.get('localization');
    const RoleList = new this.List('Role', {
        track: true,
        noscale: true,
        multilingual,
        isCore: true,
        searchFields: 'name',
        defaultColumns: 'name, delegated',
        defaultSort: '-delegated',
    });

    const keystone = this;
    
	var allLists = this.lists;
    const Types = this.Field.Types;
    const permissionOptions = [
        { value: 3, label: 'Full Permission' },
        { value: 2, label: 'Create' },
        { value: 1, label: 'View Only' },
        { value: 0, label: 'No Permission' }
    ];

    const permissionSchema = {
        Role: { 
            type: Types.Select, 
            numeric: true,
            options: permissionOptions,
            default: 1,
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
                default: 1,
                label: allLists[key].label,
                hidden: !!allLists[key].options.hidden,
            };
    	});
    }

	RoleList.add(
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

    RoleList.register();

    createDelegatedRole(keystone, RoleList.model, permissionSchema);
}

module.exports = createRoleModel;
