const _ 			= require('lodash');
/*
** Prepare the Member Profile
** Terry Chan
** 10/09/2019
*/
const profile = async (req, res) => {
    let data = {};
    let {
    	user,
    } = req;
	try {
	    user = await user
	    			.populate('role', '-name -createdAt -updatedAt -updatedFrom -__v -delegated')
	    			.populate('identity', '-name -createdAt -updatedAt -enabled -__v')
	    			.execPopulate();
	    
	    data = _.pick(user, [
			'_id',
			'email',
			'name',
			'role',
			'language',
			'contentLanguage',
			'identity',
		]);
	    
	} catch (err) {
    	return res.apiError(500, err);
    }

    return res.json({
    	data,
    });
}

module.exports = profile;
