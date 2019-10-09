const browserify = require('../../middleware/browserify');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const str = require('string-to-stream');

const buildFieldTypesStream = ({ fieldTypes }) => {
	let src = '';
	const types = _.keys(fieldTypes);
	['Column', 'Field', 'Filter'].forEach(function (i) {
		src += 'exports.' + i + 's = {\n';
		_.forEach(_.keys(fieldTypes), type => {
			if (typeof fieldTypes[type] !== 'string') return;
			src += type + ': require("../../fields/types/' + _.toLower(type) + '/' + fieldTypes[type] + i + '"),\n';
		});
		// Append ID and Unrecognised column types
		if (i === 'Column') {
			src += 'id: require("../../fields/components/columns/IdColumn"),\n';
			src += '__unrecognised__: require("../../fields/components/columns/InvalidColumn"),\n';
		}

		src += '};\n';
	});
	return str(src);
}

const installStaticFieldTypes = keystone => {
	const installationDir = _.get(keystone.get('installation'), 'plugins') || process.cwd();
	// console.log('>>>>> ', process.cwd());
	/* Prepare browserify bundles */
	const bundles = {
		fields: browserify({
			stream: buildFieldTypesStream(keystone),
			expose: 'fields',
			file: './fields.js',
			location: `${installationDir}/build/js`,
			writeToDisk: true,
		}),
	};

	bundles.fields.build();
}

module.exports = installStaticFieldTypes;
