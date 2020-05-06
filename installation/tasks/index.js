const _ 						= require('lodash');

/*
** Installation Tasks Interface
** [Abstract Interface]
** Terry Chan
** 09/10/2019
*/
class InstallationService {
    // tasks;
	constructor(options={}) {
        const {
            name,
            nextnode,
            config,
        } = options;
        // private members
        this.name = name;
        this.nextnode = nextnode;
        this.config = config;
        this.logInfo = [];
        this.defaultDir = process.env.INSTALLATION_DIR || config.rootDir;
        this.defaultBuildDir = process.env.INSTALLATION_BUILD_DIR || config.buildDir;
        // main control flow self binding
        const funcs = [
            'logger',
            'beforeInstallation',
            'afterInstallation',
            'install',
        ];
        _.forEach(funcs, func => this[func] = this[func].bind(this));
    }

    get installationInfo() {
        return {
            task: this.name,
            files: this.logInfo,
        }
    }

    set installationInfo(file) {
        this.logInfo = [
            ...this.logInfo,
            file,
        ];
    }

    logger(error, message) {
        if (process.env.LOGGER) {
            if (error instanceof Error) {
                const {
                    message,
                } = error;
                console.log('\x1b[36m%s\x1b[0m', `[Installation Service Error][${this.name}] Possible Error: `, message);
                throw new Error(message);
            } else if (message) {
                console.log('\x1b[32m%s\x1b[0m', `[Installation Service] Completed [${this.name}] Task ${message}`);
            } else {
                console.log('\x1b[33m%s\x1b[0m', `[Installation Service] Preparing [${this.name}] Task.`);
            }
        }
    }

    async afterInstallation(error, message) {
        this.logger(error, message);
    }

    beforeInstallation(error, message) {
        // being processing
        this.logger(null, message);
    }

    install() {
        // Abstract TODO method
    }
}

module.exports = InstallationService;
