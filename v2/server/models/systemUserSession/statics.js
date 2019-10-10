const _ 						= require('lodash');
const jwt 						= require('jsonwebtoken');
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
const isValidTokenType = type => _.includes(_.keys(jwtTokens), type);

const UserSchemaStatics = UserSchema => {

	const generatePairToken = () => {
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
			expiresIn,
		};
	}

	UserSchema.statics.findByTokenType = async({
		token,
		session,
		lean=true,
		population=false,
		type='sessionToken',
	}) => {
		if (!isValidTokenType(type)) {
			// no matching type of token field
			return null;
		}
		const decoded = jwt.verify(token, jwtTokens[type]);
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

		const systemUserSession = await this.findOne({
			[type]: token,
			systemUser: _.get(decoded, '_id'),
		}, {}, options);

		if (population) {
			return await systemUserSession.populate('systemUser').execPopulate();
		}

		return systemUserSession;
	};


	UserSchema.statics.generateTheToken = async({
		sessionEntity,
		payload,
	}) => {
		// create a new sessionToken and corresponding refreshToken
		const pairToken = generatePairToken();

		_.forOwn(pairToken, (field, value) => {
			sessionEntity.set(field, value);
		});
		// sessionEntity.set('sessionToken', sessionToken);
		// sessionEntity.set('refreshToken', refreshToken);
		// sessionEntity.set('expiredAt', expiresIn);
		return await sessionEntity.save();
	};
}

module.exports = UserSchemaStatics;
