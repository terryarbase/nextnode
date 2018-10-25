/**
 * Gets basic data from an Item ready to be serialised for client-side use, as
 * used by the React components and the Admin API
 */

function getBasicData (item) {
	return {
		id: item.id,
		name: this.getDocumentName(item),
	};
}

module.exports = getBasicData;
