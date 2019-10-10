const _ 						= require('lodash');
const str                       = require('string-to-stream');
// Abstract Interface
const InstallationService       = require('./../');
/*
** Install AdminUI Fieldtypes plugins
** Terry Chan
** 09/10/2019
*/
class FieldTypesService extends InstallationService {
	constructor(config) {
        super(config);
        this.location = _.get(this.config, 'sourceDir.plugin');
        // mark log
        this.installationInfo = this.location;
        // main control flow self binding
        const funcs = [
            'getFieldTypesStream',
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
    }

    getFieldTypesStream() {
        const {
            fieldTypes,
        } = this.nextnode;
        let src = '';
        _.forEach(['Column', 'Field', 'Filter'], i => {
            src = `${src}exports.${i}s = {\n`;
            _.forEach(_.keys(fieldTypes), type => {
                if (typeof fieldTypes[type] !== 'string') return;
                src = `${src}${type}: require("../../fields/types/${_.toLower(type)}/${fieldTypes[type]}${i}"),\n`;
            });
            // Append ID and Unrecognised column types
            if (i === 'Column') {
                src = `${src}id: require("../../fields/components/columns/IdColumn"),\n`;
                src = `${src}__unrecognised__: require("../../fields/components/columns/InvalidColumn"),\n`;
            }

            src = `${src}};\n`;
        });
        return str(src);
    }
    
    async install() {
        const Browserify = require(`${this.nextnode.get('nextnode root')}/admin/server/middleware/browserify`);
        const stream = this.getFieldTypesStream();
        const location = `${this.defaultDir}/${this.defaultBuildDir}/${this.location}`;
        // output log
        this.beforeInstallation();
        // start build and install the js to the client's directory
        Browserify({
            stream,
            expose: 'fields',
            file: './fields.js',
            location,
            directToDisk: true,
            writeToDisk: true,
        }).build();

        this.afterInstallation(null, `in ${location}`);

        return true;
    }
}

module.exports = FieldTypesService;
