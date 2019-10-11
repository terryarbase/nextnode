const _		= require('lodash');
const moment = require('moment');

function AccountHook (schema, options) {
	const nextnode = options.node;
	schema.pre('save', function(next) {
		const UserModel = options.schema.model;
	    (async () => {
	        try{
	        	const oldUser = await UserModel.findById(this._id);
	        	// console.log('UserModel', oldUser);
	        	if (oldUser) {
					const adminMaxLock = nextnode.get('admin max minutes');
					if (!this.isAdmin && this.lockedAt) {
					    const now = moment();
					    const lockedTime = adminMaxLock || 5;
					    const unLockTime = moment(this.lockedAt).add(lockedTime, 'minutes');
					    console.log('>[Account] Locked diff:', unLockTime.toString(), now.toString());
					    // unlock the account
					    if (now.isSameOrAfter(unLockTime)) {
					        console.log('>[Account] Unlocked User Account:', this.email);
					        this.lockedAt = null;
					        this.isAdmin = true;
					        this.incorrectPassword = 0;
					    }
					// unlock isAdmin manually
					} else if (!oldUser.isAdmin && this.isAdmin) {
					    console.log('>[Account] Unlocked User Account Manually:', this.email);
					    this.lockedAt = null;
					    this.incorrectPassword = 0;
					    // lock isAdmin manually
					} else if (oldUser.isAdmin && !this.isAdmin) {
					    console.log('>[Account] Lock User Account manually:', this.email);
					    this.lockedAt = moment().toDate();
					}
				}
				next();
			} catch (err) {
				next(new Error(err));
			}
		})();
	});
}

module.exports = AccountHook;
