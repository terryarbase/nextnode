const _                         = require('lodash');

const nextnode  		        = require('./../../../');
/*
** Identify the validator is error callback function
** if so, return to main flow and execute it
** Terry Chan
** 09-05-2019
*/
const isValidatorError = result => result && typeof result === 'function';

const populateUserRole = async(user, locales={}) => {
	const userList = nextnode.list(nextnode.get('user model'));
    const populatedUser = await userList.model.populate(user, [
        {
            path: 'role',
            select: '-createdAt -updatedAt -updatedFrom -__v -delegated',
            options: {
                lean: true,
            },
        },
        {
            path: 'identity',
            select: '-createdAt -updatedAt -enabled -__v',
            options: {
                lean: true,
            },
        }
    ]);
    // req.locales.langf
    let {
        role,
    } = populatedUser;
    if (role && !_.isArray(role)) {
        role = [ role ];
    }

    // prevent using spread
    populatedUser.role = _.map(role, r => ({
        ...r,
        name: _.get(r, `name.${locales.langf}`) || _.get(r, `name.${locales.defaultLanguage}`, ''),
    }));

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
	// let roleList = {};
    // single role
    // if (!_.isArray(role)) {
    //     roleList = { ...normalizeDocumentObject(role) };
    // } else {
        // multiple roles
    const tableList = _.keys(nextnode.lists);
    const filterRoles = _.map(role, r => _.pick(normalizeDocumentObject(r), tableList));
    // use the large permission value as the first priority
    const roleList = _.chain(tableList).reduce((rl, table) => ({
        ...rl,
        [table]: _.maxBy(filterRoles, table)[table],
    }), {}).value();
    // }

    return roleList;
};

module.exports = {
	isValidatorError,
	populateUserRole,
	readUserRoleList,
};
