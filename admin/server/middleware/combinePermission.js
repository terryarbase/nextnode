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

    console.log('> permission', permission.value)
    // req.permission = compatiblePermissionToRole(permission.value);
    req.permission = permission.value;
    req.permissionKey = permission.key;
}

function combineSinglePermission(nextNode, userPermission) {
    // pick the exist permission key in all list and field
    const booleanValue = _.reduce(nextNode.filterListsPermission(userPermission), (lpCombined, lp, lk) => ({
        ...lpCombined,
        [lk]: {
            ...nextNode.pickListPermission(lp),
            ..._.reduce(nextNode.filterFieldsPermission(lp), (fpCombined, fp, fk) => ({
                ...fpCombined,
                [fk]: nextNode.pickFieldPermission(fp),
            }), {}),
        },
    }), {})
    /*
    ** Transform to older number permission version before frontend revamp
    ** 2020-05-15
    */
    // const numberValue = _.reduce(booleanValue, (value, lp, list) => {
    //     const listObject = value[list] || (value[list] = {})
    //     listObject._list = lp._update ? 2 : (lp._view ? 1 : 0)
        
    //     const fieldPermission = nextNode.filterFieldsPermission(lp);
    //     _.forOwn(fieldPermission, (fp, fk) => {
    //         listObject[fk] = fp.update ? 2 : (fp.view ? 1 : 0)
    //     })
    //     return value
    // }, {});

    return {
        value: booleanValue,
        key: userPermission.permisionKey,
    }
}

function combineMultiplePermission(nextNode, userPermission) {
    const permissionKey = [];

    let combineList = [];
    // Format permission to comparator object
    _.forEach(userPermission, singlePermission => {
        const p = combineSinglePermission(nextNode, singlePermission);
        permissionKey.push(p.key);

        // Transform to comparator object
        _.forOwn(p.value, (lp, lk) => {
            _.forOwn(nextNode.pickListPermission(lp), (lpv, lpk) => {
                combineList.push({
                    path: `${lk}.${lpk}`,
                    value: lpv,
                })
            })
            _.forOwn(nextNode.filterFieldsPermission(lp), (fp, fk) => {
                _.forOwn(fp, (fpv, fpk) => {
                    combineList.push({
                        path: `${lk}.${fk}.${fpk}`,
                        value: fpv,
                    })
                })
            })
        });
    });
    
    // Sorting comparator object by path then permission value with DESC
    combineList = _.sortBy(combineList, ['path', 'value']).reverse();

    // Unique comparator object by path thus filter the max permission in combineList
    combineList = _.uniqWith(combineList, (item1, item2) => (
        item1.path === item2.path
    ))

    // Rebuild to original permision object format
    let combined = {};
    _.forEach(combineList, ({ path, value }) => {
        _.set(combined, path, value)
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