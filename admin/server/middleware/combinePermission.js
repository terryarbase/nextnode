const doMap         = require('lodash/map');
const doPick        = require('lodash/pick');
const doMaxBy       = require('lodash/maxBy');
const isArray       = require('lodash/isArray');

module.exports = function combinePermission(req, res) {
    const keystone = req.keystone;
    let roleList = {};
    if (req.user) {
        let userRole = req.user.role;

        // single role
        if (!isArray(userRole)) {
            req.roleList = userRole;
            return;
        }

        // multiple roles
        const tableList = Object.keys(keystone.lists);
        const filterRoles = doMap(userRole, role => {
            const roleDoc = role.toObject();
            return doPick(roleDoc, tableList);
        });
        

        doMap(tableList, table => roleList[table] = doMaxBy(filterRoles, table)[table]);
    }
    req.roleList = roleList;
}
