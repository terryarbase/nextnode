const _           			= require('lodash');

class ConfigInfoHandler {
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
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
	}

	execute() {
		// TODO
	}
}

module.exports = ConfigInfoHandler;
