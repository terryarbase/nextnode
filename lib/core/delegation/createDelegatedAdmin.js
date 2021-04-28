const _ = require('lodash');

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
    const allListKeys = _.keys(allLists);
    const Permission = nextNode.list('Permission');
    // const roleList = nextNode.list('Role');
    const userList = nextNode.list('User');
    console.log(Permission);
    try {
        // create delegated Permission if needed
        let delegatedPermission = await Permission.model.findOne({ delegated: true });
        if (!delegatedPermission) {
            const blacklist = ['Permission'];
            const {
                permissionKey: {
                    list: permissionKeyList,
                    field: permissionKeyField,
                }
            } =  Permission;

            const valueList = _.reduce(allListKeys, (array, listKey) => {
                // push list permission path
                _.forEach(permissionKeyList, lk => {
                    array.push(`${listKey}.${lk}`);
                });
                
                // no need create list field permission which is blacklist
                if (_.includes(blacklist, listKey)) return array

                // push list field permission path
                _.forOwn(allLists[listKey].fields, (schema, field) => {
                    _.forEach(permissionKeyField, fk => {
                        array.push(`${listKey}.${field}.${fk}`);
                    });
                })
                return array
            }, []);

            // set default permission value to 'true' via valueList
            const permissionData = _.reduce(valueList, (data, path) => {
                _.set(data, path, true);
                return data
            }, { ...delegatedAdminPermission });

            delegatedPermission = await new Permission.model(permissionData).save();
            console.log('> [Administrator Permission] Create a delegated Permission:', delegatedPermission._id);

            /* old version */
            // const permissionSchema = _.pick(Permission.fields, _.keys(allLists));
            // let permissionData = {
            //     ...delegatedAdminPermission
            // };
            // _.forEach(permissionSchema, (listSchema, listName) => {
            //     permissionData[listName] = {};
            //     _.forEach(listSchema.fields, (fieldSchema, fieldName) => {
            //         permissionData[listName][fieldName] = 2      // 2 for full permission (edit)
            //     });
            // });
            // delegatedPermission = await new Permission.model(permissionData).save();
            // console.log('> [Administrator Permission] Create a delegated Permission:', delegatedPermission._id);
        }

        /* Note: Disable to use role list */
        // create delegated Role if needed
        // let delegatedRole = await roleList.model.findOne({ delegated: true });
        // if (delegatedRole) {
        //     console.log('> [Administrator Role] No need create delegated Role');
        // } else {
        //     const roleSchema = Object.keys(_.pick(roleList.fields, _.keys(allLists)));
        //     let roleData = {
        //         ...delegatedAdminRole,
        //         rolePermissions: delegatedPermission._id,
        //     };
        //     _.forEach(roleSchema, listName => {
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
            // const countryRelationship = _.filter(userList.fields, field => {
            //     return field.options.ref === countryModelName;
            // });
            // if (countryRelationship.length) {
            //     const countryModel = nextNode.list(countryModelName).model;
            //     const delegateCountry = await countryModel.findOne({ isoCode: 'HK' });
            //     _.forEach(countryRelationship, field => {
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