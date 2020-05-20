const _          = require('lodash');

module.exports = function combinePermission(req, res, next) {
    const nextNode = req.keystone;
    if (!nextNode.get('rbac')) {
        return next();
    }

    let userPermission = req.user.permission.toObject();
    let permission = {};
    
    if (_.isArray(userPermission)) {
        permission = combineMultiplePermission(nextNode, userPermission);
    } else {
        permission = combineSinglePermission(nextNode, userPermission);
    }

    req.permission = permission.value;
    req.permissionKey = permission.key;
    
    next();
}

function combineSinglePermission(nextNode, userPermission) {
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
        value: nextNode.filterListsPermission(userPermission),
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
        // l -> list
        // f -> field
        // k -> key
        // v -> value
        // p -> permission
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