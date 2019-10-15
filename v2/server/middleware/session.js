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
// decode the jwt session token
const includeSessionToken = (req, res, next) => {
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
                const sessionTokenInfo = SystemUserSession.model.decyptToken({
                    token,
                });
                if (sessionTokenInfo) {
                    req.userSessionTokenInfo = sessionTokenInfo;
                    req.userSessionToken = token;
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
    next();
};
// get system session from the database if the token is valid
const includeAuthorization = async (req, res, next) => {
    try {
        if (req.userSessionToken) {
            const sysUserSession = await SystemUserSession.model.findByTokenType({
                token: req.userSessionToken,
                tokenInfo: req.userSessionTokenInfo,
                lean: false,
                population: true,
            });

            if (sysUserSession && sysUserSession.targetUser) {
                req.user = sysUserSession.targetUser;
                req.userSession = sysUserSession;
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
    } = req;
    if (!user) {
        return res.apiError(403, req.t.__('msg_user_nosignin'));
    }

    // const {
    //     userSessionTokenInfo,
    // } = req;
    // // the session token user id must be equals to the user id of the userSession from db
    // if (!user._id.equals(userSessionTokenInfo._id)) {
    //     return res.apiError(403, req.t.__('msg_user_nosignin'));
    // }

    const {
        utils: {
            populateUserRole,
        },
    } = nextnode.get('nextnode v2');
    req.user = await populateUserRole(user);

    return includeRoleList(req, res, next);
};

const includeSystemUserAndSession = async (req, res, next) => {

    if (!req.userSessionToken) {
        // can refesh the token by using refreshToken
        return res.apiError(404, req.t.__('msg_user_sessionTokenInvalid'));
    }
    if (!req.user) {
        // must login again
        return res.apiError(403, req.t.__('msg_user_nosignin'));
    }
    const {
        user,
    } = req;

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
    includeSessionToken,
	includeAuthorization,
	includeSystemUser,
    includeSystemUserAndSession,
    excludeSystemUser,
};
