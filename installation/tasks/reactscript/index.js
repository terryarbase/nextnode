const _ 						= require('lodash');
const readJsonFile              = require("edit-json-file");

// Abstract Interface
const InstallationService       = require('./../');
/*
** Install executable scripts for the react-scripts in client's package.json file 
** Terry Chan
** 09/10/2019
*/
class ReactScriptService extends InstallationService {
	constructor(config) {
        super(config);
        this.location = `${this.defaultDir}/package.json`;
        // mark log
        this.installationInfo = this.location;
        // main control flow self binding
        const funcs = [
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
    }

    getScripts() {
        return {
            "nextnodev2-start": "react-scripts start",
            "nextnodev2-build": "react-scripts build",
            "nextnodev2-test": "react-scripts test",
            "nextnodev2-eject": "react-scripts eject",
        };
    }
    
    install() {
        // mark log
        this.beforeInstallation();
        
        const packageJsonFile = readJsonFile(this.location);
        let currentScripts = packageJsonFile.get('scripts');
        currentScripts = {
            ...currentScripts,
            ...this.getScripts(),
        };
        packageJsonFile.set('scripts', currentScripts);
        packageJsonFile.save();

        this.afterInstallation(null, `by updating the package.json file in ${this.location}`);

        return true;
    }
}

module.exports = ReactScriptService;
