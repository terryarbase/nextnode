const _                         = require('lodash');

const nextnode  		        = require('./../../../');
/*
** Identify the validator is error callback function
** if so, return to main flow and execute it
** Terry Chan
** 09-05-2019
*/
const isValidatorError = result => result && typeof result === 'function';

const populateUserRole = async(user) => {
	const userList = nextnode.list(nextnode.get('user model'));
    let populatedUser = await userList.model.populate(user, {
        path: 'role',
        select: '-name -createdAt -updatedAt -updatedFrom -__v -delegated',
    });
    populatedUser = await userList.model.populate(user, {
        path: 'identity',
        select: '-name -createdAt -updatedAt -enabled -__v',
    });

    return populatedUser;
};

/*
** Read the user permission role list (supports multiple role)
** Terry Chan
** 11/10/2019
*/
const normalizeDocumentObject = target => {
    if (typeof target.toObject === 'function') {
        return target.toObject();
    }
    return target;
}
const readUserRoleList = role => {
	let roleList = {};
    // single role
    if (!_.isArray(role)) {
        roleList = { ...normalizeDocumentObject(role) };
    } else {
        // multiple roles
        const tableList = _.keys(nextnode.lists);
        const filterRoles = _.map(role, r => _.pick(normalizeDocumentObject(r), tableList));
        // use the large permission value as the first priority
        roleList = _.chain(tableList).reduce((rl, table) => ({
            ...rl,
            [table]: _.maxBy(filterRoles, table)[table],
        }), {}).value();
        _.map(tableList, table => _.maxBy(filterRoles, table)[table]);
    }

    return roleList;
};

module.exports = {
	isValidatorError,
	populateUserRole,
	readUserRoleList,
};
