const _           			= require('lodash');

class APIInterface {
	constructor({
		nextnode,
		req,
		res,
	}) {
		this.nextnode = nextnode;
		this.req = req;
		this.res = res;
		this.userList = nextnode.list(nextnode.get('user model'));
		// main control flow self binding
        const funcs = [
            'execute',
            'executeByNative',
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
	}

	getUserInfo(user) {
		return _.pick(user, [
			'_id',
			'email',
			'name',
			'role',
			'language',
			'contentLanguage',
			'identity',
		]);
	}

	/*
	** [Important]
	** Execute the query either create or update by using Nextnode Native Update Method
	** The handling method should be revamped in the next phase
	** ===================================================================================================
	** @Param:
	** list: Native List to be controlled
	** model: Mongoose Document Model to be refered
	** data: Data to be updated
	** options: Native options for the updateItem method (e.g. req.files, user, ignoreNoEdit etc) 
	** ===================================================================================================
	** @Return: Promise with empty or error
	** Terry Chan
	** 13/10/2019
	*/
	executeByNative({
		list,
		model,
		data,
		options
	}) {
		const self = this;
        return new Promise(done => {
			list.updateItem(model, data, options, err => {
                if (err) {
                    const status = err.error === 'validation errors' ? 400 : 500;
                    const error = err.error === 'database error' ? err.detail : err;
                    return done({
                    	error,
                    	status,
                    });
                }
                done(null);
            });
		});
	}

	execute() {
		// TODO
	}
}

module.exports = APIInterface;
