const _ 			= require('lodash');
const utils 		= require('keystone-utils');

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

const createList = async(list, keystone, startSession) => {
	if (list.options.isCore) return;
	const {
		key: name,
		fields,
	} = list;
	const ModelList = keystone.list('ModelList');

	let session = null;
	let result = null;
	try {
        // start the transaction section
        session = await startSession();
        session.startTransaction();

        const result = await ModelList.model.findOneAndUpdate({
			name,
		}, {
			name,
			path: utils.keyToPath(name, true),
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
			// save all of it's fields
			result.fields = _.map(modelFields, m => m._id);
			await result.save();
		} else {
			console.log('> [Failed] Created/Updated List Entry: ', name);
		}

        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
    } finally {
        session.endSession();
    }
	return result;
}	

const createSessionList = async (lists, keystone, startSession) => {
    const tasks = _.map(_.keys(lists), listName => createList(lists[listName], keystone, startSession));
	await Promise.all(tasks);
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
