const {
	session: {
		includeAuthorization,
	},
	locale: {
		includeLocale,
	},
} = require('./../middleware');

const registerCommonRoutes = ({
	nextnode,
	router,
	api,
}) => {
	const checkPermission = require(`${nextnode.get('nextnode root')}/admin/server/middleware/checkPermission`);
	
	const includeAPIError = require(`${nextnode.get('nextnode root')}/admin/server/middleware/apiError`);
	const includeLogError = require(`${nextnode.get('nextnode root')}/admin/server/middleware/logError`);

	// all of routes under v2 should carry about authorization middleware hooking
	router.all([
		'/app/v2/*',
	], 
		includeAPIError, 
		includeLogError,
		includeAuthorization,	// jwt authorization hookin
		includeLocale,	// localiztion hooking
	);

	// get the initial config either system user or non-signin user
	router.get('/app/v2/info', checkPermission(0), (req, res) => {
		return new api.common.info({ nextnode, req, res }).execute();
	});
};

module.exports = registerCommonRoutes;