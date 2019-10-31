var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');


/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */
function textarea (list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['format', 'crop'];
	/*
	** Using the total number of the rows 
	** Terry Chan
	** 31/04/2019
	*/
	this.height = options.height || 5;
	this.multiline = true;
	this._properties = ['height', 'multiline', 'copy'];
	textarea.super_.call(this, list, path, options);
}
textarea.properName = 'Textarea';
util.inherits(textarea, FieldType);


textarea.prototype.validateInput = TextType.prototype.validateInput;
textarea.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
textarea.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
textarea.prototype.crop = TextType.prototype.crop;

/**
 * Formats the field value
 * @api public
 */
textarea.prototype.format = function (item, options) {
	return utils.textToHTML(this.getItemFromElasticData(item, this.path, options));
	// return utils.textToHTML(item.get(this.path));
};

/* Export Field Type */
module.exports = textarea;
