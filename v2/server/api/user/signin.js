const _ 				= require('lodash');
const moment 			= require('moment');
/*
** authorize the user for login as member 
** Terry Chan
** 10/09/2019
*/

class SignInHandler {
	constuctor(nextnode, req, res) {
		this.nextnode = nextnode;
		this.req = req;
		this.res = res;
		this.sysUser = null;
		this.userModel = nextnode.list('User');
		this.accountStatusOptions = nextnode.Options.status.pure;
		// const {
		// 	model: {
		// 		systemUserSession: userSessionModel,
		// 	},
		// } = nextnode.get('nextnode v2');
		// this.userSessionModel = userSessionModel;
		// main control flow self binding
        const funcs = [
            // 'preMemberEmail',
            // 'preMemberPassword',
            // 'preMemberStatus',
            // 'postMember',
            // 'brokeMember',
            'execute',
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
	}

	// Pre-checking for the System User Session
	async preSession (userInfo){
		const {
			model: {
				systemUserSession: SystemUserSession,
			},
		} = nextnode.get('nextnode v2');

		const sessionEntity = new SystemUserSession();
		return await SystemUserSession.generateTheToken({
			sessionEntity,
			userInfo,
		});
	};

	// Pre-checking for the System User Email valid
	async preMemberEmail() {
		let {
	    	body: {
	    		email,
	    	},
	    } = this.req;
	    // case insensitive
	    email = _.trim(_.toLower(email));

		// step 1: check for the current user
		this.sysUser = await this.userModel.authorisedEmail({
			email,
		});
		if (!currentUser) {
			return () => this.res.apiError(406, req.t.__('msg_user_invalidMember'));
		}

	    // the system user assume must be found in this phase
	    return null;
	}

	async preMemberPassword() {
		// step 2: check for the password
		const {
			body: {
				password,
			},
		} = req;
		const isCorrectPassword = await this.userModel.authorisedPassword({
			sysUser: this.sysUser,
			password,
		});

		if (!isCorrectPassword) {
			return () => this.res.apiError(406, req.t.__('msg_user_incorrectPassword'));
		}

		return null;
	}

	// Post-handling for the System User account status
	postMember () {
		this.sysUser.set('lastLoginAt', moment().toDate());
		this.sysUser.set('isAdmin', true);
		this.sysUser.save();
	}

	// Post-handling for the System User account locking status
	brokeMember () {
		if (this.sysUser) {
			const lockEnabled = this.nextnode.get('admin lock');
			const maxLock = this.nextnode.get('admin max lock');
			this.userModel.authorisedLockState({
				sysUser: this.sysUser,
				lockEnabled,
			});
		}
	}

	preMemberStatus () {
		// step 3: check for the account status
		const {
			Options: {
				status,
			},
		} = this.nextnode;
		if (this.sysUser.accountStatus === this.accountStatusOptions.disabled.value) {
			return () => this.res.apiError(406, req.t.__('msg_user_accountFreeze'));
		}

		// step 4: check for the account locking status
		const minutes = this.nextnode.get('admin lock minutes');
		const lockEnabled = this.nextnode.get('admin lock');
		if (lockEnabled && !this.sysUser.isAdmin) {
			return () => this.res.apiError(406, req.t.__('msg_user_locked', {
				minutes: lockEnabled,
			}));
		}

	    // the system user assume must be found in this phase
	    return null;
	}

	async execute() {
		let data = {};
		let sysUser = null;
		try {
			// check for email first
		    let infoChecker = await this.preMemberEmail();
		    // if system user error caught
		    if (infoChecker) {
		    	return infoChecker();
		    }

		    // check for password, if invalid, then log the locking info
		    infoChecker = await this.preMemberPassword();
		    // if system user error caught
		    if (infoChecker) {
		    	// update locking info
		    	brokeMember();
		    	return infoChecker();
		    }

		    // check for account enabled status or locking status
		    infoChecker = await this.preMemberStatus();
		    // if system user error caught
		    if (infoChecker) {
		    	return infoChecker();
		    }

		    nextnode = _.pick(sysUser, [
				'_id',
				'email',
				'name',
			]);
		    // create the user token session
		    const sysUserSession = await this.preSession(data);

		    nextnode = {
		    	...userInfo,
		    	..._.pick(sysUserSession, [
		    		'refreshToken',
		    		'sessionToken',
		    	]),
		    };

		    // no need to wait, update locking state
		    this.postMember();
		} catch (err) {
			// update locking info
		    this.brokeMember();
	    	return res.apiError(500, err);
	    }

	    return this.res.json({
	    	data,
	    });
	}
}

module.exports = options => new SignInHandler(options).execute();
