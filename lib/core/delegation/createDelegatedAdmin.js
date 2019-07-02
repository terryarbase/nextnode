// const _find = require('lodash/find');
const _chain = require('lodash/chain');
const _keys = require('lodash/keys');
const _map = require('lodash/map');
const _forOwn = require('lodash/forOwn');
const _filter = require('lodash/filter');
const _pick = require('lodash/pick');

let delegatedAdminPermission = {
    name: 'Super Administrator',
    permissionKey: 'systemadmin',
    delegated: true,
}

let delegatedAdminRole = {
    name: 'Super Administrator',
    roleKey: 'systemadmin',
    delegated: true,
}

let delegatedAdminUser = {
    name: 'System Super Administrator',
    email: 'admin@4d.com.hk',
    // encryted
    password: '12345678',   // should be changed for the first login
    isAdmin: true,
    delegated: true,
}

/*
** Fung Lee
** 15/06/2019
*/

async function createDelegatedAdmin() {
    const nextNode = this;
    const allLists = nextNode.lists;
    const permissionList = nextNode.list('Permission');
    // const roleList = nextNode.list('Role');
    const userList = nextNode.list('User');
    
    try {
        // create delegated Permission if needed
        let delegatedPermission = await permissionList.model.findOne({ delegated: true });
        if (delegatedPermission) {
            // update all list include 'Permission'
            _forOwn(allLists, (list, path) => {
                const permission = {};
                _forOwn(list.fields, (schema, field) => {
                    permission[field] = 2;
                    delegatedPermission.set(path, permission);
                });
            });

            // override special list as 'Permission'
            delegatedPermission.set('Permission', {
                _list: 2,
            });
            delegatedPermission.save();
            console.log('> [Administrator Permission] Update delegated Permission list and field');
        } else {
            const permissionSchema = _pick(permissionList.fields, _keys(allLists));
            let permissionData = {
                ...delegatedAdminPermission
            };
            _map(permissionSchema, (listSchema, listName) => {
                permissionData[listName] = {};
                _map(listSchema.fields, (fieldSchema, fieldName) => {
                    permissionData[listName][fieldName] = 2      // 2 for full permission (edit)
                });
            });
            delegatedPermission = await new permissionList.model(permissionData).save();
            console.log('> [Administrator Permission] Create a delegated Permission:', delegatedPermission._id);
        }

        /* Note: Disable to use role list */
        // create delegated Role if needed
        // let delegatedRole = await roleList.model.findOne({ delegated: true });
        // if (delegatedRole) {
        //     console.log('> [Administrator Role] No need create delegated Role');
        // } else {
        //     const roleSchema = Object.keys(_pick(roleList.fields, _keys(allLists)));
        //     let roleData = {
        //         ...delegatedAdminRole,
        //         rolePermissions: delegatedPermission._id,
        //     };
        //     _map(roleSchema, listName => {
        //         roleD[listName] = 2;
        //     });
        //     delegatedRole = await new roleList.model(roleData).save();
        //     console.log('> [Administrator Role] Create a delegated Role:', delegatedRole._id);
        // }

        // create delegated admin user account if needed
        let delegatedUser = await userList.model.findOne({ delegated: true });
        if (delegatedUser) {
            if (delegatedUser.permission !== delegatedPermission._id) {
                delegatedUser.permission = delegatedPermission._id;
                delegatedUser.save();
                console.log('> [Administrator Account] Update delegated account related permission');
            }
            console.log('> [Administrator Account] No need create delegated account');
        } else {
            let userData = {
                ...delegatedAdminUser,
                permission: delegatedPermission._id,
            };

            // TODO: how to set the extend required field data? just like below

            /* set default country */
            // const countryModelName = 'CountryCode';
            // const countryRelationship = _filter(userList.fields, field => {
            //     return field.options.ref === countryModelName;
            // });
            // if (countryRelationship.length) {
            //     const countryModel = nextNode.list(countryModelName).model;
            //     const delegateCountry = await countryModel.findOne({ isoCode: 'HK' });
            //     _map(countryRelationship, field => {
            //         userData = {
            //             ...userData,
            //             [field.path]: delegateCountry._id,
            //         }
            //     })
            // }

            delegatedUser = await new userList.model(userData).save();
            console.log('> [Administrator Account] Create a delegated administrator account: ', delegatedUser._id);
        }
    } catch (err) {
        console.log('> [Administrator Account] error:', err);
        process.exit(1);
    }
}

module.exports = createDelegatedAdmin;