const _ 						= require('lodash');
const jwt 						= require('jsonwebtoken');
const moment                    = require('moment');
// Configuration
const {
    userSession: {
        jwtTokens,
    },
} = require('./../../config');
/*
** Enhance Schema Statics
** Terry Chan
** 09/10/2019
*/
const UserSchemaStatics = UserSchema => {

    UserSchema.statics.authorisedLockState = async({
        sysUser,
        counter=1,
        lockEnabled,
        maxLock=5,
    }) => {
        if (lockEnabled && sysUser.isAdmin) {
            sysUser.set('incorrectPassword', sysUser.incorrectPassword + counter);
            if (update.incorrectPassword >= maxLock) {
                sysUser.set('isAdmin', false);
                sysUser.set('lockedAt', moment().toDate());

                return await sysUser.save();
            }
        }
        return sysUser;
    };

    UserSchema.statics.authorisedPassword = async({
        password,
        sysUser,
    }) => {
        return new Promise(resolve => {
            member._.password.compare(password, (err, result) => {
                if (err || !result) {
                    return resolve(false);
                }
                return resolve(true);
            });
        });
    };

	UserSchema.statics.authorisedEmail = async({
		email,
		lean=false,
		session,
	}) => {
		// prepare a session query or not with a lean option
		let options = {
			lean,
		};
		if (session) {
			options = {
				...options,
				session,
			};
		}
		return await this.findOne({
            email,
        }, {}, options);

        // if (!sysUser) {
        // 	throw new Error('invalidMember');
        // }
        // const validPassword = await isMatchToPassword(sysUser, password);
        // if (!validPassword) {
        // 	throw new Error('incorrectPassword');
        // }

        // return sysUser;
	};

}

module.exports = UserSchemaStatics;
