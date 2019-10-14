/*
** Common routing for the basic user account authorization
** Usage: used to the client to handle the basic login flow, no need to recap the behaviors
** ===========================================================================================
** @Parameters
** 	1. nextnode: The library instance object
**  2. router: Basic App Router depends on the callee
** ===========================================================================================
** Terry Chan
** 13/10/2019
*/
const registerUserRoutes = ({
	nextnode,
	router,
	apiVersion,
}) => {
	const {
		middleware: {
			session: {
				includeSystemUser,
				excludeSystemUser,
			},
		},
		api: {
			user: userAPI,
		},
	} = nextnode.get('nextnode v2');

	router.post(
		`/app/${apiVersion}/signin`, 
		excludeSystemUser, 
		(req, res) => new userAPI.signin({ nextnode, req, res }).execute(),
	);

	router.post(
		`/app/${apiVersion}/refreshSession`,
		(req, res) => userAPI.refresh({ nextnode, req, res }),
	);

	// all of routes under v2/session must carry about authorization
	router.all([
		`/app/${apiVersion}/session*`,
	], includeSystemUser);

	router.get(
		`/app/${apiVersion}/session`, 
		(req, res) => userAPI.session({ nextnode, req, res }),
	);

	router.post(
		`/app/${apiVersion}/session/signout`, 
		userAPI.signout,
	);

	router.get(
		`/app/${apiVersion}/session/profile`, 
		(req, res) => new userAPI.profile({ nextnode, req, res }).execute(),
	);

	router.post(
		`/app/${apiVersion}/session/profile`, 
		(req, res) => new userAPI.account({ nextnode, req, res }).execute(),
	);

};

module.exports = registerUserRoutes;