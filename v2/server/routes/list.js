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
	const {
		list: listAPI,
	} = api;
	// router.all([
	// 	'/app/v2/session/content/*'
	// ], includeList);

	router.get(
		'/app/v2/session/content/:listId',
		includeList,
		checkPermission(1, { allowBasic: true }),
		initDataPermission,
		require(`${v1ServerPath}/api/list/get`),
	);
	// router.get(
	// 	'/app/v2/content/:listId/:format(export.excel|export.json|export.txt)',
	// 	includeList,
	// 	checkPermission(1),
	// 	initDataPermission,
	// 	require(`${v1ServerPath}/api/list/download`),
	// );
	router.post(
		'/app/v2/session/content/:listId',
		includeList,
		checkPermission(2),
		(req, res) => listAPI.create({ nextnode, req, res }),
	);
	// router.put(
	// 	'/app/v2/session/content/:listId',
	// 	includeList,
	// 	checkPermission(2),
	// 	initDataPermission,
	// 	require(`${v1ServerPath}/api/list/update`),
	// );
	// router.delete(
	// 	'/app/v2/session/content/:listId',
	// 	includeList, 
	// 	checkPermission(2),
	// 	initDataPermission,
	// 	require(`${v1ServerPath}/api/list/delete`),
	// );
};

module.exports = registerListRoutes;