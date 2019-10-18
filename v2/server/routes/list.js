const {
	session: {
		includeSessionToken,
		includeAuthorization,
	},
	list: {
		includeList,
	},
	locale: {
		includeLocale,
	},
} = require('./../middleware');

const registerListRoutes = ({
	nextnode,
	router,
	api,
}) => {
	const v1ServerPath = `${nextnode.get('nextnode root')}/admin/server`;
	const v1ServerMiddlewarePath = `${v1ServerPath}/middleware`;
	const checkPermission = require(`${v1ServerMiddlewarePath}/checkPermission`);
	const initDataPermission = require(`${v1ServerMiddlewarePath}/initDataPermission`);
	
	router.all([
		'/app/v2/list*'
	], includeList, initDataPermission);

	router.get(
		'/app/v2/list/:list',
		checkPermission(1, { allowBasic: true }),
		require(`${v1ServerPath}/api/list/get`),
	);
	router.get(
		'/app/v2/list/:list/:format(export.excel|export.json|export.txt)',
		checkPermission(1),
		require(`${v1ServerPath}/api/list/download`),
	);
};

module.exports = registerListRoutes;