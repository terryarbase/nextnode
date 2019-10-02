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
	const adminPath = keystone.get('admin path') || process.env.ADMIN_PATH;
	return {
		...reactScriptsConfig,
		entry: [
      		path.resolve(__dirname, '../../../../src/index.js'),
    	],
		output: {
			...reactScriptsConfig.output,
			// use customized <script> src for the bundle js file
			filename: `static/js/[name].[contenthash:8].js`,
	      	chunkFilename: `static/js/[name].[contenthash:8].chunk.js`,
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
	process.chdir(path.resolve(__dirname, '../../../../'));
	const config = staticClientConfig(keystone);
	const router = express.Router();
	const compiler = webpack(config);
	// router.use(webpackDevMiddleware(compiler));
	compiler.run((err, stats) => {
		if (err || stats.hasErrors()) {
			throw new Error(`> [Error] AdminUI Bundle (${stats.errors})`);
		}
		console.log('\x1b[32m%s\x1b[0m', `> AdminUI Main Bundle: ${config.output.filename}.`);
		console.log('\x1b[32m%s\x1b[0m', `> AdminUI Chunk Bundle: ${config.output.chunkFilename}.`);
		// bundle the field type after that
		createStaticFieldTypes(keystone);
	});
}

module.exports = {
	createStaticClient,
	staticClientConfig,
};
