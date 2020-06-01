const _ = require('lodash');

const prepareListQuery = async (nextnode, doc, next) => {
    const fetchQueryData = async (id, key) => {
        const PermissionListField = nextnode.list('PermissionListField');
        const pf = await PermissionListField.model.findById(id);
       return pf[key]
    }
    try {
        const queryFields = _.pickBy(doc, (value ,key) => /^(.*)Query$/.test(key));

        const translateTasks = _.map(queryFields, async query => {
            if (query.isPopulate) {
                if (!query.populate || !query.populateField) {
                    query.isPopulate = false
                    query.populate = undefined
                    query.populateField = undefined
                }
            } else {
                query.populate = undefined
                query.populateField = undefined
            }

            if (query.value) {
                query._value = await fetchQueryData(query.value, 'field')
            } else {
                query._value = undefined
            }

            if (query.field) {
                query._field = await fetchQueryData(query.field, 'field')
            } else {
                query._field = undefined
            }
            
            if (query.populateField) {
                query._populateField = await fetchQueryData(query.populateField, 'field')
            } else {
                query._populateField = undefined
            }
        })
        await Promise.all(translateTasks);
        next();
    } catch (err) {
        next(new Error(err));
    }
}

function PermissionHook (schema, options) {
	const nextnode = options.node;
	schema.pre('save', async function(next) {
        const doc = this._doc;
        // const allLists = _.keys(nextnode.lists);
        // const PermissionList = nextnode.list('Permission');
        // const PermissionListField = nextnode.list('PermissionListField');

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
        await prepareListQuery(nextnode, doc, next);

        // (async () => {
        //     try {
        //         const queryFields = _.chain(doc)
        //             .keys()
        //             .filter(key => /^(.*)Query$/.test(key))
        //             .value();

        //         const tasks = _.map(queryFields, async field => {
        //             const translateTasks = await _.map(doc[field], async query => {
        //                 const userField = await PermissionListField.model.findById(query.userField);
        //                 query.field = userField.field;
                        
        //                 if (query.targetField) {
        //                     const targetField = await PermissionListField.model.findById(query.targetField);
        //                     query.populateField = targetField.field;
        //                 }
        //                 return query;
        //             });
                    
        //             return await Promise.all(translateTasks);
        //         })
        //         await Promise.all(tasks);
        //         next();
		// 	} catch (err) {
		// 		next(new Error(err));
		// 	}
        // })();
        next();
	});
}

module.exports = PermissionHook;