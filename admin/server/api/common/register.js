/*
** Register the key param to User model
** E.g. push token
** Terry Chan
** 29/03/2019
*/
const _ = require('lodash');

module.exports = async (req, res) => {
	const keystone = req.keystone;
	const registerFields = [
		'browserDeviceToken',
		'enabledBrowserPush',
	];
	const userList = keystone.list('users');
	// specific the fields to be saved
	const options = {
		ignoreNoEdit: true,
		user: req.user,
		fields: registerFields,
	};
	// obtain the fields to be save from request data user pairs to construct the array into an object
	const data = _.fromPairs(_.map(registerFields, f => [f, req.body[f]]));

	// remove all of the same browser DeviceToken
	// in case use the same kind of browser to login different account
	if (data.browserDeviceToken) {
		await userList.model.update({
			browserDeviceToken: data.browserDeviceToken,
			_id: {
				$ne: req.user._id,
			},
		}, {
			browserDeviceToken: null,
		}, {
			multi: true
		}).exec();
	}

	userList.updateItem(req.user, data, options, function (err) {
		if (err) {
			var status = err.error === 'validation errors' ? 400 : 500;
			var error = err.error === 'database error' ? err.detail : err;
			return res.apiError(status, err);
		}
		res.json({
			data,
		});
	});
};
