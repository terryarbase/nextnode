const _             = require('lodash');
/*
** Prepare the Member Signout Behavior
** Terry Chan
** 13/10/2019
*/
const signout = async (req, res) => {
    const {
    	user,
    	userSession,
    } = req;
	try {
	    await userSession.remove();
	} catch (err) {
    	return res.apiError(500, err);
    }

    return res.json({
    	data: _.pick(user, [
    		'_id',
    		'email',
    		'name',
    	]),
    });
}

module.exports = signout;
