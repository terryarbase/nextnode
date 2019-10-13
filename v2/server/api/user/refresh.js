const _             = require('lodash');
/*
** Prepare the Member Refresh Token Behavior
** Terry Chan
** 13/10/2019
*/
const refresh = async ({
    nextnode,
    req,
    res,
}) => {
    const {
        body: {
            refreshToken,
            sessionToken,
        },
    } = req;
    const UserSessionList = nextnode.get('nextnode v2').model.systemUserSession.model;
    let UserSession = null;
	try {
        UserSession = await UserSessionList.model.findByTokenType({
            token: refreshToken,
            lean: false,
            type: 'refreshToken',
            population: true,
        });
        // which is a valid refresh session,
        if (UserSession) {
            // the pair sessionToken does not match to the given sessionToken
            if (UserSession.get('sessionToken') !== sessionToken) {
                return res.apiError(403, req.t.__('msg_user_invalidRefreshToken'));
            }

            UserSession = await UserSessionList.model.refreshTheToken({
                sysUserSession: UserSession,
            });

        } else {
            return res.apiError(403, req.t.__('msg_user_invalidRefreshToken'));
        }
	    // await userSession.remove();
	} catch (err) {
    	return res.apiError(500, err);
    }

    return res.json({
    	data: _.pick(UserSession, [
            'sessionToken',
            'refreshToken',
        ]),
    });
}

module.exports = refresh;
