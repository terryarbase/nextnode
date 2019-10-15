const _ 						= require('lodash');
const jwt 						= require('jsonwebtoken');
const moment 					= require('moment');
/*
** Enhance Schema Statics
** Terry Chan
** 09/10/2019
*/
const isValidTokenType = (jwtTokens, type) => _.includes(_.keys(jwtTokens), type);

const UserSchemaStatics = function(UserSchema, config) {
	// Configuration
	const {
	    userSession: {
	        jwtTokens,
	        maxSessionPerUser,
	    },
	} = config;

	const verifyJWTToken = ({
		type,
		token,
	}) => {
		let decoded = null;
		try {
			decoded = jwt.verify(token, jwtTokens[type].secret);
		} catch (err) {
			console.log(err);
		}
		return decoded;
	}

	const generatePairToken = user => {
		const payload = _.pick(user, [
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
		userSession,
	}) {
		// create a new sessionToken and corresponding refreshToken
		const pairToken = generatePairToken(userSession.targetUser);

		_.forOwn(pairToken, (value, field) => {
			userSession.set(field, value);
		});

		return await userSession.save();
	};

	UserSchema.statics.decyptToken = function({
		token,
		type='sessionToken',
	}) {
		if (!isValidTokenType(jwtTokens, type)) {
			// no matching type of token field
			return null;
		}
		
		return verifyJWTToken({
			type,
			token,
		});
	};

	UserSchema.statics.findByTokenType = async function({
		token,
		tokenInfo,
		session,
		lean=true,
		population=false,
		type='sessionToken',
	}) {
		if (!isValidTokenType(jwtTokens, type)) {
			// no matching type of token field
			return null;
		}
		let targetUser = _.get(tokenInfo, '_id');
		// if the token info is not executed at middleware
		if (!tokenInfo) {
			const decoded = verifyJWTToken({
				token, 
				type,
			});

			if (!decoded) {
				// the given token cannot be varified (possible reason: already exipred, no mathcing jwt secret)
				return null;
			} else {
				targetUser = _.get(decoded, '_id');
			}
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
			targetUser,
		};
		if (population) {
			return await this.findOne(condition, {}, options).populate('targetUser');
		}
		return await this.findOne(condition, {}, options);
	};

	UserSchema.statics.generateTheToken = async function({
		sessionEntity,
		user,
	}){
		// create a new sessionToken and corresponding refreshToken
		const pairToken = generatePairToken(user);

		_.forOwn(pairToken, (value, field) => {
			sessionEntity.set(field, value);
		});
		sessionEntity.set('targetUser', user._id);

		// find out any maximum session
		const sessions = await this.find({
			targetUser: user._id,
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
