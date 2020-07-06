const _ = require('lodash');

const checkListPermission = (nextNode, req, requiredPermission, options) => {
    if (!requiredPermission.length) return true;
    return nextNode.isPermissionAllow(req.listPermission, requiredPermission);
}

const checkFieldPermission = (nextNode, req, requiredPermission, options) => {
    if (!requiredPermission.length) return;
    
    // all field be allow in 'Permission' list
    if (req.list.key === 'Permission') {
        req.permissionAllowFields = _.keys(req.list.fields);
        return;
    }

    const {
        fieldsPermission,
        body
    } = req;
    const {
        excludeTarget = '',
        exclude = true,
    } = options;
    
    // set allow fields to req for custom handle needed
    req.permissionAllowFields = _.chain(fieldsPermission)
        .pickBy(fp => nextNode.isPermissionAllow(fp, requiredPermission))
        .keys()
        .value();

    if (exclude) {
        switch(req.method) {
            case 'GET': {
                const input = _.get(req, excludeTarget);
                if (!input) break;
                // exclude not allow fields in target string
                const excluded = _.chain(input)
                    .split(',')
                    .filter(field => _.includes(req.permissionAllowFields, field))
                    .join(',')
                    .value();
                _.set(req, excludeTarget, excluded);
                break;
            }
            case 'POST': {
                // exclude not allow fields in body
                req.body = _.pick(body, req.permissionAllowFields);  
                break;
            }
        }
    }
}

module.exports = function checkPermission(requiredPermission = {}, options) {
    options = _.assign({}, { allowBasic: false }, options);
    const {
        list: requiredListPermission = [],
        field: requiredFieldPermission = [],
    } = requiredPermission;
    return function(req, res, next) {
        if (!req.permission) {
            return next();
        }

        if (options.allowBasic && (req.query.basic === '' || req.query.basic === 'true')) {
            return next();
        }

        // prepare current list permission
        const nextNode = req.keystone;
        const currentListPermission = req.permission[req.list.key];
        req.listPermission = nextNode.pickListPermission(currentListPermission);
        req.fieldsPermission = nextNode.filterFieldsPermission(currentListPermission);

        const isListAllow = checkListPermission(nextNode, req, requiredListPermission, options);
        if (!isListAllow) {
            return res.status(403).json({ error: req.t.__('msg_permission_denied') });
        }

        checkFieldPermission(nextNode, req, requiredFieldPermission, options);

        next();
    };
}