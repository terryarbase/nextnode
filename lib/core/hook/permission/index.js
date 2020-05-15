const _ = require('lodash');

function PermissionHook (schema, options) {
	const nextnode = options.node;
	schema.pre('save', function(next) {
        const doc = this._doc;
        // const allLists = _.keys(nextnode.lists);
        // const PermissionList = nextnode.list('Permission');
        const PermissionListField = nextnode.list('PermissionListField');

        /* old version */
        // List Permission
        // _.chain(doc)
        //     .pick(allLists)
        //     .forOwn((field, path) => {
        //         // set the table permission to max of field permission
        //         if (PermissionList.fields[path].options.ignoreCombine) {
        //             doc[path]._list = field._list;
        //             return;
        //         }

        //         doc[path]._list = _.chain(field._doc)
        //             .filter((value, key) => !/^_(.*)/.test(key))    // filter out _id, _list
        //             .values()
        //             .max()
        //             .value();
        //     })
        //     .value();

        // List Query
        (async () => {
            try {
                const queryFields = _.chain(doc)
                    .keys()
                    .filter(key => /^(.*)Query$/.test(key))
                    .value();

                const tasks = _.map(queryFields, async field => {
                    const translateTasks = await _.map(doc[field], async query => {
                        const userField = await PermissionListField.model.findById(query.userField);
                        query.field = userField.field;
                        
                        if (query.targetField) {
                            const targetField = await PermissionListField.model.findById(query.targetField);
                            query.populateField = targetField.field;
                        }
                        return query;
                    });
                    
                    return await Promise.all(translateTasks);
                })
                await Promise.all(tasks);
                next();
			} catch (err) {
				next(new Error(err));
			}
        })();
	});
}

module.exports = PermissionHook;