const _ 	= require('lodash');

const preparePermissionQuery = async (nextNode, permissionQueries, user, list) => {
	const {
		hasQuery,		// is exercise permission search
		isPopulate,		// is search with associative table
		populate,		// which associative table wanna search
		populateField,	// which field wanna match in associative table
		field,			// which field related to associative table
		value,			// match value fetched from user data
	} = nextNode.getPermissionQuery(permissionQueries, list.key);

	let query = {}
	if (hasQuery) {
		if (isPopulate) {
			/*
			** [Beta]
			** get the matched id list from associative table to search the target table
			** TODO? How to quickly query in associative table with massive entry 
			** create index? or another way?
			*/
			const listModel = nextNode.list(populate).model
			const matchEntry = await listModel.find({
				[populateField]: user[value]
			})
			query = {
				[field]: {
					$in: _.map(matchEntry, entry => entry._id),
				}
			}
		} else {
			query = {
				[field]: user[value]
			}
		}
	}

	// console.log('> permissionQuery debug', {
	//     hasQuery,
	//     isPopulate,
	//     populate,
	//     populateField,
	//     field,
	//     value,
	// 	query,
	// })
	return query;
	
	/* old version use systemIdentity */
	// const {
	// 	identity,
	// 	delegated,
	// } = user;
	// let query = {};
	// // the super delegated user can get all of items from the list
	// if (delegated) {
	// 	return query;
	// }
	// const systemIdentity = list.isSystemIdentity(list.path);
	// const {
	// 	mongoose: {
	// 		Types: {
	// 			ObjectId,
	// 		},
	// 	},
	// } = nextNode;
	// // fields mapping
	// const hasIdentityField = !!list.fields.identifiedBy;
	// // console.log(list.path);
	// // assign query
	// if (systemIdentity) {
	// 	// only query the current user's identity
	// 	if (identity && ObjectId.isValid(identity)) {
	// 		query = {
	// 			_id: ObjectId(identity),
	// 		};
	// 	}
	// } else if (hasIdentityField && identity && ObjectId.isValid(identity)) {
	// 	// force to query aginst identityBy
	// 	query = {
	// 		identifiedBy: ObjectId(identity),
	// 	};
	// // prevent not set identity field, then query only empty
	// } else {
	// 	query = {
	// 		$or: [
	// 			{
	// 				identifiedBy: { 
	// 					$exists: false,
	// 				},
	// 			},
	// 			{
	// 				identifiedBy: { 
	// 					$eq: null,
	// 				},
	// 			},
	// 			{
	// 				identifiedBy: { 
	// 					$eq: '',
	// 				},
	// 			},
	// 		],
	// 	};
	// }
	// return query;
}

// prepare for all of list defined
const preparePermissionQueries = async (nextNode, permissionQueries, user) => {
	const tasks = _.map(nextNode.lists, async l => [ l.key, await preparePermissionQuery(nextNode, permissionQueries, user, l) ]);
	const queries = await Promise.all(tasks);
	return _.fromPairs(queries);

	// return _.chain(nextNode.lists)
	// 		.map(l => [ l.key, preparePermissionQuery(user, l, nextNode) ])
	// 		.fromPairs()
	// 		.value();
}

module.exports = initDataPermission = async (req, res, next) => {
	const nextNode = req.keystone;
	// individual route
	if (!!req.params.list) {
		req.permissionQuery = await preparePermissionQuery(nextNode, req.permissionQueries, req.user, req.list);
	} else {
		req.permissionQuery = await preparePermissionQueries(nextNode, req.permissionQueries, req.user)
	}
	next();
};
