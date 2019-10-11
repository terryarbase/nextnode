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

	router.post('/app/v2/signin', excludeSystemUser, (req, res) => {
		return new api.user.signin({ nextnode, req, res }).execute();
	});
	router.get('/app/v2/session/profile', api.user.profile);
};

module.exports = registerUserRoutes;