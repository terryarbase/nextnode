// const keystone = require('keystone');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _find = require('lodash/find');
const _keys = require('lodash/keys');
const _map = require('lodash/map');
const _forOwn = require('lodash/forOwn');
/**
* Role Model
* ==========
*/
var delegatedAdmin = {
    name: 'System Super Administrator',
    email: 'admin@4d.com.hk',
    // encryted
    password: '12345678',   // should be changed for the first login
    isAdmin: true,
    delegated: true,
}

var delegatedRole = {
    name: 'Super Administrator',
    delegated: true,
}

const createDelegatedAccount = async (node, model, role) => {
    const user = node.list('User').model;
    try {
        // const delegatedRole = await role.findOne({ delegated: true });
        var delegatedAccount = await user.findOne({ delegated: true });
        if (!delegatedAccount) {
            const schema = { ...delegatedAdmin, role: role._id };

            delegatedAccount = await new user(schema).save(); 
            console.log('> [Administrator Account] Create a delegated administrator account: ', delegatedAccount._id);
        } else {
            console.log('> [Administrator Account] Delegated administrator account and no need to create');
        }
    } catch (err) {
        console.log('> [Administrator Account] Cannot create a delegated administrator account.');
        console.log(err);
        process.exit(1);
    }
};

const updateExistingPermission = (permissions, role) => {
    if (permissions) {
        _forOwn(permissions, (p, key) => {
            role.set(key, p);
        });
    }
};

const createDelegatedRole = async (list, node, model, permissions) => {
    const localization = node.get('localization');
    const currentLanguage = node.get('locale');
    try {
        var newRole = await model.findOne({ delegated: true });
        var permission = {};
        if (permissions) {
            _forOwn(permissions, (p, key) => {
                permission = { 
                    ...permission,
                    ...{
                        [key]: 3,
                    },
                };
            });
        }
        if (!newRole) {
            var schema = { ...delegatedRole, ...permission };
            if (localization) {
                schema = {
                    ...schema,
                    roleKey: 'sysadmin',
                    name: {
                        [currentLanguage]: delegatedRole.name,
                    },
                };
            }
            // console.log(schema);
            newRole = await new model(schema).save();
            console.log('> [Account Role] Create a delegated account administrator role: ', newRole.name);
        } else {
            updateExistingPermission(permission, newRole);
            await newRole.save();
            console.log('> [Account Role] Update Delegated account administrator role: ', newRole.name);
        }
        newUser = await createDelegatedAccount(node, model, newRole);
    } catch (err) {
        console.log('> [Account Role] Cannot create a delegated account role.');
        console.log(err);
        process.exit(1);
    }
};

function createRoleModel () {
    const advancedPermissionList = this.get('advanced role permissions') || {};
    const multilingual = this.get('localization');
    var RoleList = this.lists['Role'];

    if (!RoleList) {
        RoleList = new this.List('Role', {
            track: true,
            noscale: true,
            multilingual,
            isCore: true,
            searchFields: 'name',
            defaultColumns: 'name',
            defaultSort: '-delegated',
        });
    }

    const nextnode = this;
    
    var allLists = this.lists;
    const Types = this.Field.Types;
    const permissionOptions = 'permission';
    // [
    //     { value: 3, label: 'Full Permission' },
    //     { value: 2, label: 'Create' },
    //     { value: 1, label: 'View Only' },
    //     { value: 0, label: 'No Permission' }
    // ];
    const permissionSchema = {
        Role: { 
            type: Types.Select, 
            numeric: true,
            options: permissionOptions,
            assign: true,
            default: 0,
            label: RoleList.label,
            restrictDelegated: true,
        },
    };
    var roles = nextnode.get('role list');
    // use customerized ordering
    if (roles) {
        roles = {
            ...roles,
            ...nextnode.reservedRoleListCollections(),
        };
        Object.keys(roles).forEach(function (key) {
            if (roles[key]) {
                if (key === 'Role') {
                    const roleSchema = permissionSchema['Role'];
                    delete permissionSchema['Role'];
                    permissionSchema['Role'] = roleSchema;
                } else if (allLists[key]){
                    // use customized permission list instead
                    const advanced = advancedPermissionList[allLists[key].key] || {};
                    permissionSchema[allLists[key].key] = { 
                        type: Types.Select, 
                        numeric: true,
                        options: permissionOptions,
                        default: 0,
                        assign: true,
                        restrictDelegated: true,
                        label: allLists[key].label,
                        hidden: !!allLists[key].options.hidden,
                        ...advanced,
                    };
                }
            }
        });
    } else {    // by default
    	Object.keys(allLists).forEach(function (key) {
            // use customized permission list instead
            const advanced = advancedPermissionList[allLists[key].key] || {};
            permissionSchema[allLists[key].key] = { 
                type: Types.Select, 
                numeric: true,
                options: permissionOptions,
                default: 0,
                assign: true,
                restrictDelegated: true,
                label: allLists[key].label,
                hidden: !!allLists[key].options.hidden,
                ...advanced,
            };
    	});
    }
    RoleList.add(
        {
            name: { type: Types.Text, required: true, initial: true, index: true, min: 2 },
            roleKey: { type: Types.Text, multilingual: false, required: true, initial: true },
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
    // else {
    //     Object.keys(permissionSchema).forEach(function(s) {
    //         if (!RoleList.get(s)) {
    //             RoleList.set(s, permissionSchema[s]);
    //         }
    //     });
    // }
    // RoleList.register();
    // return createDelegatedRole(RoleList, nextnode, RoleList.model, permissionSchema);
}

module.exports = createRoleModel;
