module.exports = function checkPermission(requiredLevel, options) {
    options = Object.assign({}, { allowBasic: false }, options);
    return function(req, res, next) {
        var keystone = req.keystone;
        if (!keystone.get('rbac')) {
            return next();
        }

        if (options.allowBasic && (req.query.basic === '' || req.query.basic === 'true')) {
            return next();
        }

        if (req.user.role[req.list.key] < requiredLevel) {
            return res.status(403).json({ error: 'You are not permited.' });
        }
        next();
    };
}
