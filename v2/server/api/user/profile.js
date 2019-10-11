const _ 			= require('lodash');
/*
** Prepare the Member Profile
** Terry Chan
** 10/09/2019
*/
const profile = async ({
	nextnode,
	req,
	res,
}) => {
    let data = {};
    let {
    	user,
    } = req;
	try {
	    data = _.pick(user, [
			'_id',
			'email',
			'name',
			'role',
			'language',
			'contentLanguage',
			'identity',
		]);

		const {
			utils: {
				readUserRoleList,
			},
		} = nextnode.get('nextnode v2');
	    
		data = {
			...data,
			role: readUserRoleList(data.role),
		};

	} catch (err) {
    	return res.apiError(500, err);
    }

    return res.json({
    	data,
    });
}

module.exports = profile;
