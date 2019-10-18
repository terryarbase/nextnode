const nextnode                  = require('./../../../');

const includeList = (req, res, next) => {
	req.list = nextnode.list(req.params.listId);
	if (!req.list) {
		return res.apiError(404, req.t.__('msg_list_notfound'));
	}

	next();
};

module.exports = {
	includeList,
};