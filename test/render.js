import test from 'ava';

import pify from 'pify';
import globby from 'globby';

import sass from 'node-sass';

import { withSassFfiOptions } from '..';

const render = pify(sass.render);

const renderTestMacro = async (t, file) => {
	const result = await render(withSassFfiOptions({
		file,
		outputStyle: 'expanded',
	}));
	t.snapshot(result.css.toString('utf8'));
};

renderTestMacro.title = (providedTitle, file) => providedTitle || `render snapshot for ${file}`;

globby.sync('./fixtures/render/*.scss', {
	cwd: __dirname,
	absolute: true,
}).forEach(file => {
	test(renderTestMacro, file);
});
