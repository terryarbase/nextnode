const sharp			= require('sharp');
const sizeOf 		= require('image-size');
const {
	existsSync,
	readFileSync,
	statSync,
} 					= require('fs');
const _forEach 		= require('lodash/forEach');
const _map 			= require('lodash/map');
const _isArray 		= require('lodash/isArray');


class Base64ImageResizer{
	/*
	** // @param: request files (default [])
	** @param: max image width size (default 600px)
	** @param: max image height size (default 1000px)
	** @param: max image file size (default 1MB)
	** @param: max number of file to be uploaded (default -1 no limit)
	** @param: output mine type of image (default jpeg type)
	*/
	constructor(options = {}) {
		const {
			maxWidth= 600,
			maxHeight= 600,
			maxSize= 1024000,
			maxLength= -1,
			outputType= 'jpeg',
		} = options;
        this.files = [];
        this._baseFiles = [];
        this._maxWidth = maxWidth;
        this._maxSize = maxSize;
        this._maxHeight = maxHeight;
        this.resizeBase64Images = this.resizeBase64Images.bind(this);
        // this._maxNo = maxNo;
        this._prefix = `data:image/${outputType};base64,`;
        // if (maxNo !=== -1 && files.length > maxNo) {
        // 	throw new Error('Invalid Uploaded Number of Image');
        // }
    }
    set files(files) {
    	this._baseFiles = [];
    	this._files = !_isArray(files) ? [files] : files;
    }
    getFiles() {
    	return this._baseFiles;
    }
    getFile() {
    	return this._baseFiles[0];
    }
    /*
    ** Get standard width height of image
    ** @param1: image path
    */
    getStatWdithInfo(image) {
    	return new Promise(resolve => {
		    	// console.log('>>>>image>>>>>', image, sizeOf);
		    sizeOf(image, (err, size) => {
		      	// console.log('>>>>>>>>>', err, size);
			    if(err) {
			       throw(err);
			    }
			    resolve(size);
		   	});
		    // setTimeout(() => {
		    // 	console.log('> getStatWdithInfo');
		    // 	resolve();
		    // }, 3000);
		});
    }
    /*
	** calculate proportion of image
	*/
	getProportion({ width,  height }) {
		if (width && height) {
			const proportion = width / height;
			if (width > height) {
				return {
					width: this._maxWidth,
					height: Math.round(this._maxWidth / proportion),
				};
			} else if (height > width) {
				return {
					width: Math.round(this._maxHeight * proportion),
					height: this._maxHeight,
				};
			} else {	// original image proportion is 1:1 
				return {
					width: this._maxWidth,
					height: this._maxWidth,
				};
			}
		}
		return {};
	}

	isCompressedTobe({ width, height }, size) {
		return width && height && size && size > this._maxSize;
	}


    async collectImageInfo(file) {
    	if (file) {
	    	const { path, size: originalSize } = file;
	    	var current = file;
	    	if (path && existsSync(path)) {
		     	console.log('> start convert to base64 string: ', path);
				const base64 = readFileSync(path, 'base64');
				// if the file is request file stream, the size can be obtained
				const size = originalSize || statSync(path).size;
				const info = await this.getStatWdithInfo(path);
				// console.log('> info baseFiles: ', info);
				const needCompress = this.isCompressedTobe(info, size);
				var optimize;
				if (needCompress) {
					optimize = this.getProportion(info);
				}
				current = {
					file,
					path, 
				   	base64: needCompress ? base64 : `${this._prefix}${base64}`,		// encoded base64 image string
				   	info,									// basic image info (e.g. width, height)
				   	size,									// original size of source image
				    needCompress,
				    optimize,								// optimized width and height against this.maxWidth
				};
				// console.log('current: ', current.info, current.needCompress);
				
			}
			this._baseFiles = [ ...this._baseFiles, current];
		}
    }
    /*
    ** Convert all of files stream to base64
    */
 	//  async convertToBase64() {
	//     // read binary data
	//     if (this._files.length) {
	// 		// convert binary data to base64 encoded string
	// 		const infoTasks = _map(this._files, file => this.collectImageInfo(file));
	// 		await Promise.all(infoTasks).catch(err => console.log('> convertToBase64: ', err));
	// 	}
		
	// }
	resizeFromSharp(buffer, width, height) {
		return new Promise(resolve => {
		    sharp(buffer)
		    	.resize(width, height)
		    	.toBuffer((err, data, info) => {
		    		if (err) {
		    			throw(err);
		    		}
		    		if (data) {
		    			resolve(`${this._prefix}${data.toString('base64')}`);
		    		}
		    	});
		    // setTimeout(() => {
		    // 	console.log('> getStatWdithInfo');
		    // 	resolve();
		    // }, 3000);
		});
    }
    /*
    ** Process resize base64 if provided
    */
	async processResize(file) {
		const { optimize, base64 } = file;
		if (base64 && optimize && optimize.width && optimize.height) {
			const { width, height } = optimize;
			// new Buffer(b64string, 'base64')
			const resized = await this.resizeFromSharp(Buffer.from(base64, 'base64'), width, height);
			// console.log('resized: ', resized);
			if (resized) {
				return {
					...file,
					path: resized,
				}
			}
		}
		// no need to optimize
		return file;
	}
	/*
	** resize the base64 image with optimized info
	*/
	async resizeBase64Images() {
		if (this._files.length) {
			// convert binary data to base64 encoded string
			const infoTasks = _map(this._files, file => this.collectImageInfo(file));
			await Promise.all(infoTasks);
			if (this._baseFiles.length) {
		    	const { _baseFiles: baseFiles } = this;
		    	const resizeTasks = _map(baseFiles, file => this.processResize(file));
				this._baseFiles = await Promise.all(resizeTasks);
				// this._baseFiles = _map(baseFiles, file => ({
				// 	...file,
				// 	path: this.resizeBase64(file),
				// }));
			}

		}
	}
}

module.exports = Base64ImageResizer;
