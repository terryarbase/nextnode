var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */
function html (list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.wysiwyg = options.wysiwyg || true;
	this.height = options.height || 180;
	this._properties = ['wysiwyg', 'height'];

	const newOptions = {
		...options,
		cloneable: true,	// for clone ui element everytime
	};
	html.super_.call(this, list, path, newOptions);
}
html.properName = 'Html';
util.inherits(html, FieldType);


html.prototype.validateInput = TextType.prototype.validateInput;
html.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
html.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/**
 * Updates the value for this field in the item from a data object
 * Overridden by some fieldType Classes
 *
 * @api public
 */
// html.prototype.updateItem = function (item, data, file, callback) {
// 	var value = this.getValueFromData(data);
// 	const options = { 
// 		subPath: data['__subPath'],
// 	};
// 	// This is a deliberate type coercion so that numbers from forms play nice
// 	if (value !== undefined && value != item.get(this.path)) { // eslint-disable-line eqeqeq
// 		if (options.subPath) {
// 			const subPath = options.subPath;
// 			const currentPathValue = item.get(this.path) || {};
// 			currentPathValue[subPath] = value;
// 			item.set(this.path, currentPathValue);
// 		} else {
// 			item.set(this.path, value);
// 		}
// 	}
// 	callback();
// };

/* Export Field Type */
module.exports = html;
