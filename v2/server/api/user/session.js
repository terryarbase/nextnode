const _ 			= require('lodash');
/*
** Initial the client's side for the member session
** Terry Chan
** 11/09/2019
*/
const session = async (options) => {
	const data = await getSessionInfo(options);
	return options.res.json({
		data,
	});
}
const getSessionInfo = async ({
	signinInfo,
	nextnode,
	req,
	res,
}) => {
	// get config information
    const {
		api: {
			common: {
				info: InfoAPI,
			},
		},
		middleware: {
			session: {
				includeRoleList,
			},
		},
		utils: {
            populateUserRole,
        },
	} = nextnode.get('nextnode v2');

	const {
		user,
	} = req;

	req.user = await populateUserRole(user);

	// normalize all of role list for the user who is loged in
	includeRoleList(req);

	// get the common app info after login
	return new InfoAPI({
		nextnode: nextnode,
		signinInfo,
		req,
		res,
	}).getInfo();
}

module.exports = session;
