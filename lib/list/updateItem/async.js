const updateAsyncItem = async function(list, item, data, options) {
	console.log('>>>>>>>>>>> ', item, data, options);
	return new Promise(resolve => {
		list.updateItem(item, data, options, err => {
			resolve(err);
		});
	});
};

module.exports = updateAsyncItem;
