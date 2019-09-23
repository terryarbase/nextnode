const _ 			= require('lodash');

const modelName = 'ModelList';

const createListItemFields = async(field, keystone, target, session) => {
	const {
		type,
		path: name,
	} = field;
	const ModelListItem = keystone.list('ModelListItem');
	return await ModelListItem.model.findOneAndUpdate({
		name,
		target,
	}, {
		name,
		target,
		type,
	}, {
		new: true,
		upsert: true,
		session,
	}).exec();
}

const createList = async(list, keystone, session) => {
	if (list.options.isCore) return;
	const {
		key: name,
		fields,
	} = list;
	const ModelList = keystone.list('ModelList');
	const result = await ModelList.model.findOneAndUpdate({
		name,
	}, {
		name,
		selectable: true,
	}, {
		new: true,
		upsert: true,
		session,
	}).exec();

	if (result) {
		console.log('> Created/Updated List Entry: ', name);
		let modelFields = _.keys(fields);
		// create all of fields from the list
		const tasks = _.map(modelFields, field => 
			createListItemFields(fields[field], keystone, result._id, session)
		);
		modelFields = await Promise.all(tasks);
		result.fields = _.map(modelFields, m => m._id);
		await result.save();
	} else {
		console.log('> [Failed] Created/Updated List Entry: ', name);
	}

	return result;
}	

const createSessionList = async (lists, keystone, startSession) => {
	let session = null;
	try {
        // start the transaction section
        session = await startSession();
        session.startTransaction();

        const tasks = _.map(_.keys(lists), listName => createList(lists[listName], keystone, session));
		await Promise.all(tasks);

        await session.commitTransaction();
    } catch (err) {
    	console.log(err);
        await session.abortTransaction();
    } finally {
        session.endSession();
    }
}

function addToDelegationModelList() {
	const {
		lists,
		mongoose: {
			startSession,
		},
	} = this;
	createSessionList(lists, this, startSession);
};

module.exports = addToDelegationModelList;
