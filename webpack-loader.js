const loaderUtils = require('loader-utils');
const sassLoader = require('sass-loader');

const { withSassFfiOptions } = require('.');

function sassFfiLoader(...args) {
	const options = withSassFfiOptions(loaderUtils.getOptions(this));

	const context = Object.create(this);

	Object.defineProperty(context, 'query', {
		enumerable: true,
		get: () => options,
	});

	return sassLoader.apply(context, args);
}

module.exports = sassFfiLoader;
