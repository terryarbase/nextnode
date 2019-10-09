const fs 						= require('fs');
const path 						= require('path');
const express 					= require('express');
const webpackDevMiddleware 		= require('webpack-dev-middleware');
const webpack 					= require('webpack');

// React Data Field Types
const createStaticFieldTypes 	= require('./createStaticFieldTypes');

const resolveApp = (relativePath, appDirectoryclear) => path.resolve(appDirectory, relativePath);

const staticClientConfig = (keystone={}) => {
	const env = 'production';
	const reactScriptsConfig = require('react-scripts/config/webpack.config')(env);
	const appDirectory = fs.realpathSync(__dirname);

	// let {
	// 	module,
	// } = reactScriptsConfig;
	// module.rules[1].use[0].options.baseConfig = {
 //        "no-undef": 0,
 //        "react/jsx-no-undef": 0,
	// };

	// const adminPath = keystone.get('admin path') || process.env.ADMIN_PATH;
	return {
		...reactScriptsConfig,
		entry: [
      		path.resolve(__dirname, '../../../../src/index.js'),
    	],
		output: {
			...reactScriptsConfig.output,
			// use customized <script> src for the bundle js file
			filename: `static/js/[name].js`,
	      	chunkFilename: `static/js/[name].chunk.js`,
		},

		plugins: [
			...reactScriptsConfig.plugins,
			new webpack.ProgressPlugin({
				entries: true,
				modules: true,
				modulesCount: 500,
				profile: true,
				handler: (percentage, message, ...args) => {
					const nextPercentage = Math.round(percentage * 100);
					console.log('\x1b[36m%s\x1b[0m', `Bundling AdminUI, Completed ${nextPercentage}%`);
				}
			}),
		],
	};
}

function createStaticClient(keystone={}) {
	// const browserify = require('../../middleware/browserify');
	// /* Prepare browserify bundles */
	// const bundles = {
	// 	adminUI: browserify({
	// 		file: './appv2/main.js',
	// 		location: './../../../build/static/js',
	// 		writeToDisk: true,
	// 	}),
	// };

	// bundles.adminUI.build();
	// createStaticFieldTypes(keystone);
	process.chdir(path.resolve(__dirname, '../../../../'));
	const config = staticClientConfig(keystone);
	const router = express.Router();
	const compiler = webpack(config);
	// router.use(webpackDevMiddleware(compiler));
	compiler.run((err, stats) => {
		// if (err && err.details) {
		// 	console.log('details: ', err.details);
		// 	throw new Error(err.details);
	 //    }

	 //    if (stats.hasErrors()) {
	 //    	const info = stats.toJson();
	 //    	console.log('errors: ', info.errors);
	 //        throw new Error(info.errors);

	 //    }
	 //    if (stats.hasWarnings()) {
	 //    	console.log('warnings: ', info.warnings);
	 //        throw new Error(info.warnings);
	 //    }

		console.log('\x1b[32m%s\x1b[0m', `> AdminUI Main Bundle: ${config.output.filename}.`);
		console.log('\x1b[32m%s\x1b[0m', `> AdminUI Chunk Bundle: ${config.output.chunkFilename}.`);
		// bundle the field type after that
		// createStaticFieldTypes(keystone);
	});
}

module.exports = {
	createStaticClient,
	staticClientConfig,
};
