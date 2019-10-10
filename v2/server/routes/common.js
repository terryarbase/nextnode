const {
	session: {
		includeAuthorization,
	},
} = require('./../middleware');

const registerCommonRoutes = ({
	nextnode,
	router,
}) => {
	const checkPermission = require(`${nextnode.get('nextnode root')}/admin/server/middleware/checkPermission`);
	// all of routes under v2 should carry about authorization middleware hooking
	router.all([
		'/app/v2*',
	], includeAuthorization);

	// get the initial config either system user or non-signin user
	router.get('/app/v2/auth/config', checkPermission(0), require('./../api/config'));
};

module.exports = registerCommonRoutes;