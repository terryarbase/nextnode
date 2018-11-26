/**
 * Gets basic data from an Item ready to be serialised for client-side use, as
 * used by the React components and the Admin API
 */

function getBasicData (item, options) {
	return {
		id: item.id,
		name: this.getDocumentName(item, null, options),
	};
}

module.exports = getBasicData;
