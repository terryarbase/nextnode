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

    req.permission = permission;
}

function combineSinglePermission(nextNode, userPermission) {
    const allLists = _.keys(nextNode.lists);
    userPermission = _.pick(userPermission, allLists);

    const permission = {};
    _.forOwn(userPermission, (p, list) => {
        permission[list] = p._list;
    });
    return permission;
}

function combineMultiplePermission(nextNode, userPermission) {
    const permissions = _.map(userPermission, p => singlePermission(nextNode, p));    
    
    const combine = {};
    _.chain(permissions)
        .head()
        .forOwn((value, list) => {
            combine[list] = _.maxBy(permissions, list)[list];
        });
    return combine;
}