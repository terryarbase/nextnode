/*
** Enhance Hooking for all of system user session middleware
** Terry Chan
** 09/10/2019
*/
const authHeader                = require('auth-header');

const SystemUserSessionModel 	= require('./../models/systemUserSession');
/*
** capture the authorization header from loginToken, no error handling will be expected
** all of api can have authorization header after login no matter it is public api route
** Terry Chan
** 09/10/2019
*/
const includeAuthorization = async (req, res, next) => {
    const appToken = req.get('authorization');
    try {
        // parse decrypted jwt token 
        const authorization = authHeader.parse(appToken);
        const {
	    	scheme,
	    	token: appToken,
	    } = authorization;

	    if (appToken && scheme === 'Bearer') {
        	const sysUserSession = await SystemUserSessionModel.findByTokenType({
        		token: appToken,
        		lean: false,
        		population: true,
        	});

        	if (sysUserSession && sysUserSession.systemUser) {
        		req.user = sysUserSession.systemUser;
        	}
	    }
    } catch (err) {
        // ingore whether the bearer is provided
    }
    next();
}

const includeSystemUser = async (req, res, next) => {
    if (!req.user) {
        return req.apiError(403, req.t.__('msg_user_nosignin'));
    }
    next();
};

/*
** The hooking is for the request must not including the login session
** Terry Chan
** 10/09/2019
*/
const excludeSystemUser = async (req, res, next) => {
    if (req.user) {
        return req.apiError(406, req.t.__('msg_user_signined'));
    }
    next();
};

module.exports = {
	includeAuthorization,
	includeSystemUser,
    excludeSystemUser,
};
