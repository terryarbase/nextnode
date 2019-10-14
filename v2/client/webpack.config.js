const fs 		= require('fs');
const path 		= require('path');

const resolveApp = (relativePath, appDirectoryclear) => path.resolve(appDirectory, relativePath);

function createStaticClient(keystone) {
	const env = process.env.NODE_ENV;
	const reactScriptsConfig = require('react-scripts/config/webpack.config')(env);
	const appDirectory = fs.realpathSync(process.cwd());
	// const path = keystone.get('');

	return {
		...reactScriptsConfig,
		output: {
			...reactScriptsConfig.output,
			// use customized <script> src for the bundle js file
			filename: `js/[name].js`,
	      	chunkFilename: `js/[name].chunk.js`,
		},
	};
}

module.exports = createStaticClient(null);
