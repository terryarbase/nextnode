var chalk = require('chalk');
var crypto = require('crypto');
var fs = require('fs-extra');
var moment = require('moment');
var packages = require('../../client/packages');
var path = require('path');

var basedir = path.resolve(__dirname + '/../../client/');
var devMode = process.env.KEYSTONE_DEV === 'true';
var devWriteBundles = process.env.KEYSTONE_WRITE_BUNDLES === 'true';
var devWriteDisc = process.env.KEYSTONE_WRITE_DISC === 'true';

function ts () {
	return chalk.gray(moment().format('YYYY-MM-DD HH:MM:SS '));
}

function logInit (file) {
	console.log(chalk.grey('Watching ') + chalk.underline(file) + chalk.grey(' for changes...'));
}

function logRebuild (file) {
	console.log(ts() + chalk.green('rebuilt ' + chalk.underline(file)));
}

function logError (file, err) {
	console.log(ts() + chalk.red('error building ' + chalk.underline(file) + ':') + '\n' + err.message);
}

module.exports = function (opts) {
	var stream = opts.stream;
	var expose = opts.expose;
	var file = opts.file;
	var hash = opts.hash;
	var location = opts.location;
	var writeToDisk = opts.writeToDisk;
	// auto output to the target destination, without using __dirname
	const directToDisk = opts.directToDisk;

	var b;
	var building = false;
	var queue = [];
	var src;
	var etag;

	var logName = file.replace(/^\.\/|\..\//, '');
	var fileName = opts.out || logName;
	var bundlePath = '../../bundles/js';
	if (location) {
		bundlePath = location;
	}
	if (hash) {
		fileName = hash + '-' + fileName;
	}
	var outputFilename = path.resolve(path.join(__dirname, bundlePath, fileName));
	if (directToDisk) {
		outputFilename = path.resolve(path.join(bundlePath, fileName));
	}
	const afterBundle = (err, message) => {
		if (opts.callback) {
			opts.callback(err, message);
		}
	}

	function updateBundle (newSrc) {
		src = newSrc;
		etag = crypto.createHash('md5').update(src).digest('hex').slice(0, 6);
	}

	function writeBundle (buff) {
		// console.log('\x1b[32m%s\x1b[0m', `> AdminUI Other Bundle: ${outputFilename}.`);
		if (devWriteBundles || writeToDisk) {
			fs.outputFile(outputFilename, buff, 'utf8', function (err) {
				if (err) {
					afterBundle(err);
					return logError(fileName, err);
				}
				afterBundle(null, outputFilename);
			});
		}

		if (devWriteDisc) {
			var discFile = fileName.replace('.js', '.html');
			require('disc').bundle(buff, function (err, html) {
				if (err) {
					afterBundle(err);
					logError(discFile, err);
				} else {
					afterBundle(null, discFile);
					// fs.outputFile(path.resolve(path.join(__dirname, '../../bundles/disc', discFile)), html, 'utf8');
					console.log(ts() + chalk.green('wrote disc for ' + chalk.underline(file)));
				}
			});
		}
	}

	function build () {
		if (building) return;
		building = true;
		var babelify = require('babelify');
		var browserify = require('browserify');
		var watchify = require('watchify');
		var opts = { basedir: basedir };
		if (devMode) {
			logInit(logName);
			opts.debug = true;
			opts.cache = {};
			opts.packageCache = {};
		}
		if (devWriteDisc) {
			opts.fullPaths = true;
		}

		if (stream) {
			b = browserify(opts);
			b.require(stream, { expose: expose });
		} else {
			b = browserify(file, opts);
		}

		b.transform(babelify);
		b.exclude('FieldTypes');
		packages.forEach(function (i) {
			b.exclude(i);
		});

		if (devMode) {
			b = watchify(b, { poll: 500 });
		}
		b.bundle(function (err, buff) {

			if (err) return logError(logName, err);
			updateBundle(buff);
			queue.forEach(function (reqres) {
				send.apply(null, reqres);
			});
			// console.log('> 1');
			writeBundle(buff);
		});

		b.on('update', function () {
			b.bundle(function (err, buff) {
				if (err) return logError(logName, err);
				else logRebuild(logName);
				updateBundle(buff);
				// console.log('> 2');
				writeBundle(buff);
			});
		});
	}

	function serve (req, res) {
		// console.log('> ', src);
		if (src) {
			return send(req, res);
		}

		fs.readFile(outputFilename, function (err, data) {
			if (data) {
				fs.removeSync(outputFilename);
				updateBundle(data);
				if (devMode) {
					build();
				}
				send(req, res);
			} else {
				// console.log('> ', src);
				queue.push([req, res]);
				build();
			}
		});
	}

	function send (req, res) {
		res.setHeader('Content-Type', 'application/javascript');

		if (req.get && (etag === req.get('If-None-Match'))) {
			res.status(304);
			res.end();
		} else {
			res.set('ETag', etag);
			res.set('Vary', 'Accept-Encoding');
			res.send(src);
		}
	}

	return {
		serve: serve,
		build: build,
	};
};
