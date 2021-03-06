var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


/**
 * URL FieldType Constructor
 * @extends Field
 * @api public
 */
function url (list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['format'];
	this._properties = ['downable'];
	url.super_.call(this, list, path, options);
}
url.properName = 'Url';
util.inherits(url, FieldType);


// TODO: is it worth adding URL specific validation logic? it would have to be
// robust so as to not trigger invalid cases on valid input, might be so
// flexible that it's not worth adding.
url.prototype.validateInput = TextType.prototype.validateInput;
url.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
url.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/**
 * Formats the field value using either a supplied format function or default
 * which strips the leading protocol from the value for simpler display
 */
url.prototype.format = function (item, options) {
	var url = this.getItemFromElasticData(item, this.path, options);
	// item.get(this.path) || '';
	// console.log(url);
	if (this.options.format === false) {
		return url;
	} else if (typeof this.options.format === 'function') {
		return this.options.format(url);
	} else {
		return removeProtocolPrefix(url);
	}
};

/**
 * Remove the protocol prefix from url
 */
function removeProtocolPrefix (url) {
	return url ? url.replace(/^[a-zA-Z]+\:\/\//, '') : '';
}

/* Export Field Type */
module.exports = url;
