/*
** Enhance Hooking for all of system user session middleware
** Terry Chan
** 09/10/2019
*/
const _                         = require('lodash');
const authHeader                = require('auth-header');

const nextnode                  = require('./../../../');
const SystemUserSession 	    = require('./../models/systemUserSession/model');
const Utils                     = require('./../utils');

const includeRoleList = (req, res, next) => {
    const {
        user: {
            role,
        },
    } = req;

    req.roleList = Utils.readUserRoleList(role);

    if (next) {
        next();
    }
}
/*
** capture the authorization header from loginToken, no error handling will be expected
** all of api can have authorization header after login no matter it is public api route
** Terry Chan
** 09/10/2019
*/
const includeAuthorization = async (req, res, next) => {
    const appToken = req.get('authorization');
    try {
        if (appToken) {
            // parse decrypted jwt token 
            const authorization = authHeader.parse(appToken);
            const {
    	    	scheme,
    	    	token,
    	    } = authorization;

    	    if (token && scheme === 'Bearer') {
            	const sysUserSession = await SystemUserSession.model.findByTokenType({
            		token,
            		lean: false,
            		population: true,
            	});

            	if (sysUserSession && sysUserSession.systemUser) {
            		req.user = sysUserSession.systemUser;
                    req.userSession = sysUserSession;
            	}

                req.sessionToken = token;
    	    }
        }
    } catch (err) {
        console.log(err);
        // ingore whether the bearer is provided
    }
    next();
}

const includeSystemUser = async (req, res, next) => {
    const {
        user,
    } = req
    if (!user) {
        return res.apiError(403, req.t.__('msg_user_nosignin'));
    }
    const {
        utils: {
            populateUserRole,
        },
    } = nextnode.get('nextnode v2');
    req.user = await populateUserRole(user);

    return includeRoleList(req, res, next);
};

/*
** The hooking is for the request must not including the login session
** Terry Chan
** 10/09/2019
*/
const excludeSystemUser = async (req, res, next) => {
    if (req.user) {
        return res.apiError(406, req.t.__('msg_user_signined'));
    }
    next();
};

module.exports = {
    includeRoleList,
	includeAuthorization,
	includeSystemUser,
    excludeSystemUser,
};
