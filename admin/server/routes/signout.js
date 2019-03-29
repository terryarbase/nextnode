var session = require('../../../lib/session');

module.exports =  function SignoutRoute (req, res) {
	var keystone = req.keystone;
	(async() => {
		const user = req.user;
		session.signout(req, res, async () => {
			/*
			** Reset the browser push related
			** Terry Chan
			** 29/03/2019
			*/
			user.browserDeviceToken = null;
			user.enabledBrowserPush = false;
			try {
				await user.save();
			}catch (err) {
				console.log('> SignoutRoute: ', err);
			}
			// After logging out, the user will be redirected to /signin?signedout
			// It shows a bar on top of the sign in panel saying "You have been signed out".
			if (typeof keystone.get('signout redirect') === 'string') {
				return res.redirect(keystone.get('signout redirect'));
			} else if (typeof keystone.get('signout redirect') === 'function') {
				return keystone.get('signout redirect')(req, res);
			} else {
				return res.redirect('/' + keystone.get('admin path') + '/signin?signedout');
			}
		});
	})();
};
