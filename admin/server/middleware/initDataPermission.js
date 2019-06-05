const _ 	= require('lodash');

const preparePermissionQuery = (user, list, nextnode) => {
	const {
		identity,
		delegated,
	} = user;
	let query = {};
	// the super delegated user can get all of items from the list
	if (delegated) {
		return query;
	}
	const systemIdentity = list.isSystemIdentity(list.path);
	const {
		mongoose: {
			Types: {
				ObjectId,
			},
		},
	} = nextnode;
	// fields mapping
	const hasIdentityField = !!list.fields.identifiedBy;
	// console.log(list.path);
	// assign query
	if (systemIdentity) {
		// only query the current user's identity
		if (identity && ObjectId.isValid(identity)) {
			query = {
				_id: ObjectId(identity),
			};
		}
	} else if (hasIdentityField && identity && ObjectId.isValid(identity)) {
		// force to query aginst identityBy
		query = {
			identifiedBy: ObjectId(identity),
		};
	// prevent not set identity field, then query only empty
	} else {
		query = {
			$or: [
				{
					identifiedBy: { 
						$exists: false,
					},
				},
				{
					identifiedBy: { 
						$eq: null,
					},
				},
				{
					identifiedBy: { 
						$eq: '',
					},
				},
			],
		};
	}
	return query;
}

// prepare for all of list defined
const preparePermissionQueries = (user, nextnode) => {
	return _.chain(nextnode.lists)
			.map(l => [ l.key, preparePermissionQuery(user, l, nextnode) ])
			.fromPairs()
			.value();
}

module.exports = initDataPermission = (req, res, next) => {
	const nextnode = req.keystone;
	// individual route
	if (!!req.params.list) {
		req.permissionQuery = preparePermissionQuery(req.user, req.list, nextnode);
	} else {
		req.permissionQuery = preparePermissionQueries(req.user, nextnode)
	}
	next();
};
