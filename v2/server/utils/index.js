const nextnode  		= require('./../../../');
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

module.exports = {
	isValidatorError,
	populateUserRole,
};
