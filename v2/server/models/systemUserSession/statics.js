const _ 						= require('lodash');
const jwt 						= require('jsonwebtoken');
const moment 					= require('moment');
// Configuration
const {
    userSession: {
        jwtTokens,
        maxSessionPerUser,
    },
} = require('./../../config');
/*
** Enhance Schema Statics
** Terry Chan
** 09/10/2019
*/
const isValidTokenType = type => _.includes(_.keys(jwtTokens), type);

const UserSchemaStatics = function(UserSchema) {

	const generatePairToken = sysUser => {
		const payload = _.pick(sysUser, [
			'_id',
			'email',
			'name',
		]);
		const expiresIn = _.get(jwtTokens, 'sessionToken.expiresIn');
		// create a new sessionToken and corresponding refreshToken
		const sessionToken = jwt.sign(
			payload,
			_.get(jwtTokens, 'sessionToken.secret'),
			{
				expiresIn,
			},
		);
		const refreshToken = jwt.sign(
			payload,
			_.get(jwtTokens, 'refreshToken.secret'),
			{
				expiresIn: _.get(jwtTokens, 'refreshToken.expiresIn'),
			},
		);

		return {
			refreshToken,
			sessionToken,
			expiredAt: moment().add(expiresIn, 'ms').toDate(),
		};
	}

	UserSchema.statics.refreshTheToken = async function({
		sysUserSession,
	}) {
		// create a new sessionToken and corresponding refreshToken
		const pairToken = generatePairToken(sysUserSession.systemUser);

		_.forOwn(pairToken, (value, field) => {
			sysUserSession.set(field, value);
		});

		return await sysUserSession.save();
	};

	UserSchema.statics.findByTokenType = async function({
		token,
		session,
		lean=true,
		population=false,
		type='sessionToken',
	}) {
		if (!isValidTokenType(type)) {
			// no matching type of token field
			return null;
		}
		const decoded = jwt.verify(token, jwtTokens[type].secret);
		if (!decoded) {
			// the given token cannot be varified (possible reason: already exipred, no mathcing jwt secret)
			return null;
		}

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
		const condition = {
			[type]: token,
			systemUser: _.get(decoded, '_id'),
		};
		if (population) {
			return await this.findOne(condition, {}, options).populate('systemUser');
		}
		return await this.findOne(condition, {}, options);
	};


	UserSchema.statics.generateTheToken = async function({
		sessionEntity,
		sysUser,
	}){
		// create a new sessionToken and corresponding refreshToken
		const pairToken = generatePairToken(sysUser);

		_.forOwn(pairToken, (value, field) => {
			sessionEntity.set(field, value);
		});
		sessionEntity.set('systemUser', sysUser._id);

		// find out any maximum session
		const sessions = await this.find({
			systemUser: sysUser._id,
		}, {}, {
			sort: {
				expiredAt: 1,	// ascending order, the earlier session will be removed first
			},
		});

		if (sessions.length >= maxSessionPerUser) {
			// remove all of sessions which are over the maximum
			const maxOverSession = sessions.slice(0, sessions.length - maxSessionPerUser + 1);
			await Promise.all(_.map(maxOverSession, s => s.remove()));
		}

		return await sessionEntity.save();
	};

}

module.exports = UserSchemaStatics;
