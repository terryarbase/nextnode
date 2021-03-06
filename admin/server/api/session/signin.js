var utils = require('keystone-utils');
const moment = require('moment');
var session = require('../../../../lib/session');

function signin (req, res) {
	var keystone = req.keystone;
	// if (!keystone.security.csrf.validate(req)) {
	// 	return res.apiError(403, 'invalid csrf');
	// }
	if (!req.body.email || !req.body.password) {
		return res.status(401).json({ error: 'email and password required' });
	}
	var User = keystone.list(keystone.get('user model'));
	const adminLockEnabled = keystone.get('admin lock');
	var emailRegExp = new RegExp('^' + utils.escapeRegExp(req.body.email) + '$', 'i');
	User.model.findOne({ email: emailRegExp }).populate(keystone.get('rbac') || '').exec(function (err, user) {
		if (user) {
			keystone.callHook(user, 'pre:signin', req, function (err) {
				if (err) return res.status(500).json({ error: 'pre:signin error', detail: err });
				user._.password.compare(req.body.password, function (err, isMatch) {
					// console.log('>>>>>>', user);
					if (isMatch) {
						if (!user.isAdmin && adminLockEnabled) {
							user.updatedAt = moment().toDate();
							user.save();
							return res.status(500).json({ error: 'Your account has been locked.' });
							// onFail(err || new Error('Your account has been lacked'));
						} else if (!user.accountStatus) {
							return res.status(500).json({ error: 'Your account has been disabled. Please contact the Administrator for the helps.' });
						} else {
							session.signinWithUser(user, req, res, function () {
								keystone.callHook(user, 'post:signin', req, function (err) {
									if (err) return res.status(500).json({ error: 'post:signin error', detail: err });
									res.json({ success: true, user: user });
								});
							});
						}
					} else {
						session.updateWrongCount(User, user, 1,
						function (result) {
							const code = 401;
							const message = { error: 'The password you entered is not valid.' };
							if (err) {
								code = 500;
								message = { error: 'Bcrypt error', detail: err };
							}
							return res.status(code).json(message);
						});
					}
				});
			});
		} else if (err) {
			return res.status(500).json({ error: 'Database error', detail: err });
		} else {
			return res.status(401).json({ error: 'The email you entered is not valid.' });
		}
	});
}

module.exports = signin;
