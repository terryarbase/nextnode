const _ 				= require('lodash');
const moment 			= require('moment');

const APIInterface 		= require('./../interface');
/*
** authorize the user for login as member 
** Terry Chan
** 10/09/2019
*/
class SignInHandler extends APIInterface{

	constructor(config) {
		super(config);
		const {
			nextnode,
		} = config;
		this.sysUser = null;
		const {
			config: {
				userSession: {
					modelName: SystemUserSessionModelName,
				},
			},
		} = nextnode.get('nextnode v2');
		this.userSessionList = nextnode.list(SystemUserSessionModelName);
		this.accountStatusOptions = nextnode.Options.status.pure;
		// main control flow self binding
        // const funcs = [
        // ];
        // _.forEach(funcs, func => this[func] = this[func].bind(this));
	}

	// Pre-checking for the System User Session
	async preSession (){
		const sessionEntity = new this.userSessionList.model();
		// await this.userSessionList.mode.removeMaximumSession({
		// 	sysUser: this.sysUser,
		// });
		return await this.userSessionList.model.generateTheToken({
			sessionEntity,
			sysUser: this.sysUser,
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
		this.sysUser = await this.userList.model.authorisedEmail({
			email,
		});
		if (!this.sysUser) {
			return () => this.res.apiError(406, this.req.t.__('msg_user_invalidMember'));
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
		} = this.req;
		const isCorrectPassword = await this.userList.model.authorisedPassword({
			sysUser: this.sysUser,
			password,
		});

		if (!isCorrectPassword) {
			return () => this.res.apiError(406, this.req.t.__('msg_user_incorrectPassword'));
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
			this.userList.model.authorisedLockState({
				sysUser: this.sysUser,
				lockEnabled,
				maxLock,
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
			return () => this.res.apiError(406, this.req.t.__('msg_user_accountFreeze'));
		}

		// step 4: check for the account locking status
		const minutes = this.nextnode.get('admin lock minutes');
		const lockEnabled = this.nextnode.get('admin max lock');
		if (lockEnabled && !this.sysUser.isAdmin) {
			return () => this.res.apiError(406, this.req.t.__('msg_user_locked', {
				minutes,
			}));
		}

	    // the system user assume must be found in this phase
	    return null;
	}

	async getSigninInfo(data) {
		// get config information
	    const {
			api: {
				common: {
					info: InfoAPI,
				},
			},
			middleware: {
				session: {
					includeRoleList,
				},
			},
			utils: {
	            populateUserRole,
	        },
		} = this.nextnode.get('nextnode v2');

		this.req.user = await populateUserRole(this.sysUser);

		// normalize all of role list for the user who is loged in
		includeRoleList(this.req);

		// get the common app info after login
		return new InfoAPI({
			nextnode: this.nextnode,
			signinInfo: data,
			req: this.req,
			res: this.res,
		}).getInfo();
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

		    // check for account enabled status or locking status
		    infoChecker = await this.preMemberStatus();
		    // if system user error caught
		    if (infoChecker) {
		    	return infoChecker();
		    }

		    // check for password, if invalid, then log the locking info
		    infoChecker = await this.preMemberPassword();
		    // if system user error caught
		    if (infoChecker) {
		    	// update locking info
		    	this.brokeMember();
		    	return infoChecker();
		    }
		    // create the user token session
		    const sysUserSession = await this.preSession();

		    data = {
		    	..._.pick(this.sysUser, [
		    		'id',
		    		'email',
		    		'name',
		    	]),
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
	    	return this.res.apiError(500, err);
	    }

	    const response = await this.getSigninInfo(data);

	    return this.res.json({
	    	data: response,
	    });
	}
}

module.exports = SignInHandler;
