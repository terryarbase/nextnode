const {
	session: {
		includeSystemUser,
		excludeSystemUser,
	},
} = require('./../middleware');

const registerUserRoutes = ({
	nextnode,
	router,
}) => {
	// all of routes under v2/session must carry about authorization
	router.all([
		'/app/v2/session*',
	], includeSystemUser);

	router.post('/app/v2/signin', excludeSystemUser, arg => require('../api/user').user.signin(nextnode, ...arg));
	router.post('/app/v2/session/profile', require('../api/user/profile'));
};

module.exports = registerUserRoutes;