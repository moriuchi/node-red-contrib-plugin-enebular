const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'lib/index.js'),
	output: {
		path: path.resolve(__dirname, 'resources'),
		filename: 'enebularPlugin.js',
		library: {
			name: 'enebularPlugin',
			type: 'umd'
		}
	},
	target: ['web'],
	mode: 'production'
};
