const doMap         = require('lodash/map');
const doPick        = require('lodash/pick');
const doMaxBy       = require('lodash/maxBy');
const isArray       = require('lodash/isArray');

module.exports = function combinePermission(req, res) {
    const keystone = req.keystone;
    let roleList = {};
    if (req.user) {
        let userRole = req.user.role.toObject();

        // single role
        if (!isArray(userRole)) {
            req.roleList = userRole;
            return;
        }

        // multiple roles
        const tableList = Object.keys(keystone.lists);
        const filterRoles = doMap(userRole, role => doPick(role, tableList));
        

        doMap(tableList, table => roleList[table] = doMaxBy(filterRoles, table)[table]);
    }
    req.roleList = roleList;
}
