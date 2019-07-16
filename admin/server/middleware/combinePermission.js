const _          = require('lodash');

module.exports = function combinePermission(req, res) {
    const nextNode = req.keystone;
    let userPermission = req.user.permission.toObject();

    let permission = {};
    if (_.isArray(userPermission)) {
        permission = combineMultiplePermission(nextNode, userPermission);
    } else {
        permission = combineSinglePermission(nextNode, userPermission);
    }

    // req.permission = compatiblePermissionToRole(permission.value);
    req.permission = permission.value;
    req.permissionKey = permission.key;
}

function combineSinglePermission(nextNode, userPermission) {
    return {
        value: nextNode.pickListPermission(userPermission),
        key: userPermission.permisionKey,
    }
}

function combineMultiplePermission(nextNode, userPermission) {
    const permissionKey = [];
    
    let combineList = [];
    // Format permission to comparator object
    _.forEach(userPermission, singlePermission => {
        const permission = combineSinglePermission(nextNode, singlePermission);
        permissionKey.push(permission.key);

        // Transform to comparator object
        _.forOwn(permission.value, (fields, list) => {
            delete fields._id;
            _.forOwn(fields, (p, field) => {
                combineList.push({
                    list,
                    field,
                    permission: p,
                });
            })
        });
    });

    // Sorting comparator object by path then permission with DESC
    combineList = _.sortBy(combineList, ['list', 'field', 'permission']).reverse();

    // Unique comparator object by path thus filter the max permission in combineList
    combineList = _.uniqWith(combineList, (item1, item2) => (
        item1.list === item2.list && item1.field === item2.field
    ))

    // Rebuild to original permision object format
    let combined = {};
    _.forEach(combineList, item => {
        combined[item.list] = {
            ...combined[item.list],
            [item.field]: item.permission,
        }
    });

    return {
        value: combined,
        key: permissionKey,
    }
}

function compatiblePermissionToRole(rolePermision) {
    /*
    ** Transform one layer Object of 'Role' (list only) in old version
    ** to two layer nested 'Permission' Object (list and field)
    ** for compatible 'Permission' in old version
    ** Fung Lee
    ** 12/07/2019
    */
    const permission = {};
    _.forOwn(permision, (p, list) => {
        permission[list] = {
            _list: p,
        }
    });
    return permission;
}