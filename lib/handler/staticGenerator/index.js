const fs 	= require('fs');
const _			= require('lodash');

/*
** Interface to handle all of type to ecport static config fiel
** e.g. lamguage section, locale
** Terry Chan
** 30/11/2018
*/
class StaticGenerator {
	constructor(nextNode, path) {
        this.node = nextNode;
        this.staticFilePath = path;
        // binding self member
        const funcs = ['exportStatic'];
        _.forEach(funcs, func =>  this[func] = this[func].bind(this))
    }

 	writeStatic(setting, path) {
		return new Promise((resolve, reject) => {
			var data = JSON.stringify(setting);
			fs.writeFile(path || this.staticFilePath, data, { flag: 'w' }, err => {
			    if (err) reject(err);
			    resolve();
			});
		});
	}

	async exportStaticByPath (data, path) {
		// write out the static file for later requests
		try {
			await this.writeStatic(data, path);
		} catch (err) {
			return {
				load: true,
				error: err,
			} 
		}
		console.log('> Finished to write the Static File to: ', path);
		return { data };
	}

	async exportStatic (data) {
		// write out the static file for later requests
		try {
			await this.writeStatic(data);
		} catch (err) {
			return {
				load: true,
				error: err,
			} 
		}
		console.log('> Finished to write the Static File to: ', this.staticFilePath);
		return { data };
	}
}

module.exports = StaticGenerator;
