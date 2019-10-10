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
	// all of routes under v2/session must carry about authorization
	router.all([
		'/app/v2/session*',
	], includeSystemUser);
	console.log(api.user.signin);
	router.post('/app/v2/signin', excludeSystemUser, arg => api.user.signin(nextnode, ...arg));
	router.post('/app/v2/session/profile', api.user.profile);
};

module.exports = registerUserRoutes;