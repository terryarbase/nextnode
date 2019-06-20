const _map          = require('lodash/map');
const _forOwn       = require('lodash/forOwn');
const _keys         = require('lodash/keys');
const _pick         = require('lodash/pick');
const _maxBy        = require('lodash/maxBy');
const _isArray      = require('lodash/isArray');
// const _toInteger    = require('lodash/toInteger');

module.exports = function combinePermission(req, res) {
    const nextNode = req.keystone;

    let userPermission = req.user.permission.toObject();
    
    let permission = {};
    if (_isArray(userPermission)) {
        permission = multiplePermission(nextNode, userPermission);
    } else {
        permission = singlePermission(nextNode, userPermission);
    }

    console.log('>>> combine permission', permission);
    req.roleList = permission;

    // single role
    // if (!_isArray(userPermission)) {
    //     req.roleList = userRole;
    //     return;
    // }

    // // multiple roles
    // const tableList = Object.keys(keystone.lists);
    // const filterRoles = _map(userRole, role => _pick(role, tableList));
    // const roleList = {};

    // _map(tableList, table => roleList[table] = _maxBy(filterRoles, table)[table]);
    
    // req.roleList = roleList;
}

function singlePermission(nextNode, userPermission) {
    console.log('>>> singlePermission()');
    const allLists = _keys(nextNode.lists);

    userPermission = _pick(userPermission, allLists);
    // console.log('>>> userPermissions', userPermission);

    const permission = {};
    _forOwn(userPermission, (value, list) => {
        permission[list] = value._table;
    })
    return permission;
}

function multiplePermission(nextNode, userPermission) {

}