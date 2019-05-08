import path from 'path';
import vm from 'vm';
import MemoryFileSystem from 'memory-fs';

import test from 'ava';

import pify from 'pify';

import webpack from 'webpack';

const fs = new MemoryFileSystem();

test('webpack output snapshot', async t => {
	const compiler = webpack({
		mode: 'development',
		devtool: 'none',
		entry: path.join(__dirname, 'fixtures', 'webpack', 'index.js'),
		output: {
			path: '/',
			filename: 'output.js',
		},
		module: {
			rules: [
				{
					test: /\.scss$/,
					use: [
						'to-string-loader',
						'css-loader',
						{
							loader: './webpack-loader',
							options: {
								outputStyle: 'expanded',
							},
						},
					],
				},
			],
		},
	});
	compiler.outputFileSystem = fs;

	const stats = await pify(compiler.run).call(compiler);
	const { errors } = stats.compilation;

	if (errors.length > 0) {
		const [ headError, ...tailErrors ] = errors;
		tailErrors.forEach(error => console.error(error));
		throw headError;
	}

	const source = fs.readFileSync('/output.js', 'utf8');

	const script = new vm.Script(source);
	const sandbox = {};
	script.runInNewContext(sandbox);

	t.snapshot(sandbox.css);
});
