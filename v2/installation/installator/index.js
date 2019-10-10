const _ 						= require('lodash');
const fs                        = require('fs');
const moment                    = require('moment');
const readJsonFile              = require("edit-json-file");

/*
** Chain Service for installation all of client components to the client's project dir
** [Abstract Interface]
** Terry Chan
** 09/10/2019
*/
class Installator {
    /*
    ** flag for process the execution
    ** if the installation.verion is not the same as the version from the log file
    ** the installation should be executed, otherwise, the installation should be ignored
    */
    installable = false;
	constructor(nextnode) {
        this.options = {
            nextnode,
        };
        this.config = nextnode.get('installation');
        this.installable = false;
        this.logFile = 'nextnode.lock';
        this.logData = {};
        this.dateFormat = 'YYYY-MM-DD HH:mm:ss';
        // validation the option fields
        this.validateOptions();
        this.readInstallationLog();
        // main control flow self binding
        const funcs = [
            'validateOptions',
            'readInstallationLog',
            'writeInstallionLog',
            'execute',
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
    }

    /*
    ** Pre-validator for the installation option of the nextnode
    ** Terry Chan
    ** 09/10/2019
    */ 
    validateOptions() {
        const {
            rootDir,
        } = this.config;
        // check for client's root project directory
        if (rootDir) {
            const packageJson = `${rootDir}/package.json`;
            if (!fs.existsSync(rootDir)) {
                throw new Error(`[Installator] "rootDir" does not exists.`);
            } else if (!fs.existsSync(packageJson)) {
                throw new Error(`[Installator] package.json does not exists.`);
            }
        } else {
            throw new Error(`[Installator] Mssing Parameter for "rootDir" in nextnode.get('installation').`);
        }

        // check for client's build folder
        const {
            buildDir,
        } = this.config;
        if (buildDir) {
            const buildFolder = `${rootDir}/${buildDir}/`;
            if (!fs.existsSync(buildFolder)) {
                fs.mkdirSync(buildFolder);
                // throw new Error(`[Installator] "buildDir" does not exists.`);
            }
        } else {
            throw new Error(`[Installator] Mssing Parameter for "rootDir" in nextnode.get('installation').`);
        }

        const {
            sourceDir,
        } = this.config;
        // check for source js folder in the client's root project directory
        if (sourceDir) {
            const sourceFields = [
                'js',
                'plugin',
            ];
            const message = _.reduce(sourceFields, (m, field) => {
                if (!_.has(sourceDir, field)) {
                    return [
                        ...m,
                        field,
                    ];
                }
                return m;
            }, []);

            if (message.length) {
                throw new Error(`[Installator] missing source directory(s) (${message.join(', ')}) for "sourceDir" in nextnode.get('installation').`);
            }

            _.forEach(sourceFields, field => {
                const path = `${rootDir}/${buildDir}/${sourceDir[field]}`;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
            });
        } else {
            throw new Error(`[Installator] Mssing Parameter for "sourceDir" in nextnode.get('installation').`);
        }
    }

    readInstallationLog() {
        const {
            version=-1,
            rootDir,
            buildDir,
        } = this.config;
        let logFile = `${rootDir}/${buildDir}/${this.logFile}`;
        logFile = readJsonFile(logFile);
        // get the version log histories
        const versions = logFile.get('versions');
        if (version && !_.includes(versions, version)) {
            // turn to install the tasks immediately
            this.installable = true;
        }
        this.logData = logFile;
    }

    writeInstallionLog() {
        const {
            version=1,
        } = this.config;
        let versions = this.logData.get('versions') || [];
        versions = [
            ...versions,
            version,
        ];
        // update nextnode.lock file
        // this.logData.set('version', process.env.npm_package_version);
        this.logData.set('versions', _.uniq(versions));
        this.logData.set('last-install', moment().format(this.dateFormat));
        // save the current installation log
        this.logData.save();
        // save the nextnode property also
        this.options.nextnode.set('last install version', version);
    }

    async execute() {
        if (this.installable) {
            const self = this;
            const installationTasks = require('./config');
            // execute the chain of the tasks
            const tasks = _.map(installationTasks, task => {
                if (task.installer) {
                    // start install the task
                    return new task.installer({
                        ...self.options,
                        name: task.name,
                        config: self.config,
                    }).install();
                }

                return true;
            });

            let installationResult = await Promise.all(tasks);
            installationResult = _.compact(installationResult);

            if (installationResult.length === tasks.length) {
                this.writeInstallionLog();
                // any installation failed
                console.log('\x1b[32m%s\x1b[0m', `Installation Completed.`);
            } else {
                // TODO, any installation failed
                console.log('\x1b[36m%s\x1b[0m', `Installation Failed.`);
            }
        } else {
            console.log('\x1b[32m%s\x1b[0m', `[Installation] had completely installed before. You may change the version in nextnode.get('intallation') if you want to force execute the installation again.`);
        }
    }
}

module.exports = Installator;
