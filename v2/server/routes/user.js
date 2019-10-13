const {
	session: {
		includeSystemUser,
		excludeSystemUser,
	},
} = require('./../middleware');

const registerUserRoutes = ({
	nextnode,
	router,
	api,
}) => {
	router.post(
		'/app/v2/signin', 
		excludeSystemUser, 
		(req, res) => new api.user.signin({ nextnode, req, res }).execute(),
	);

	router.post(
		'/app/v2/refreshSession',
		(req, res) => api.user.refresh({ nextnode, req, res }),
	);

	// all of routes under v2/session must carry about authorization
	router.all([
		'/app/v2/session*',
	], includeSystemUser);

	router.get(
		'/app/v2/session', 
		(req, res) => api.user.session({ nextnode, req, res }),
	);

	router.post(
		'/app/v2/session/signout', 
		api.user.signout,
	);

	router.get(
		'/app/v2/session/profile', 
		(req, res) => new api.user.profile({ nextnode, req, res }).execute(),
	);

	router.post(
		'/app/v2/session/profile', 
		(req, res) => new api.user.account({ nextnode, req, res }).execute(),
	);

};

module.exports = registerUserRoutes;