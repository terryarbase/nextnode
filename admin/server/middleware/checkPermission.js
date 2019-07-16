const combinePermission = require('../middleware/combinePermission');

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

        combinePermission(req, res);
        
        if (req.permission[req.list.key] < requiredLevel) {
            return res.status(403).json({ error: req.t.__('msg_permission_denied') });
        }

        next();
    };
}