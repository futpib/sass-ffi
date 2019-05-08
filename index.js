const path = require('path');
const dotProp = require('dot-prop');

const sass = require('node-sass');

const toJS = sassValue => {
	if (sassValue instanceof sass.types.Number) {
		return sassValue.getValue();
	}

	if (sassValue instanceof sass.types.String) {
		return sassValue.getValue();
	}

	// TODO?: color

	if (sassValue instanceof sass.types.Boolean) {
		return sassValue.getValue();
	}

	if (sassValue instanceof sass.types.Null) {
		return null;
	}

	if (sassValue instanceof sass.types.List) {
		const length = sassValue.getLength();
		const result = [];
		for (let i = 0; i < length; i++) {
			result.push(toJS(sassValue.getValue(i)));
		}

		// TODO?: separator

		return result;
	}

	throw new TypeError(`Could not convert an expected SASS value \`${sassValue}\` to a JS value.`);
};

const toSass = jsValue => {
	if (typeof jsValue === 'number') {
		return new sass.types.Number(jsValue);
	}

	if (typeof jsValue === 'string') {
		return new sass.types.String(jsValue);
	}

	// TODO?: color

	if (typeof jsValue === 'boolean') {
		return jsValue ? sass.types.Boolean.TRUE : sass.types.Boolean.FALSE;
	}

	if (Array.isArray(jsValue)) {
		const result = new sass.types.List(jsValue.length);

		for (const [ i, value ] of jsValue.entries()) {
			result.setValue(i, toSass(value));
		}

		// TODO?: separator

		return result;
	}

	if (jsValue === null || jsValue === undefined) {
		return sass.types.Null.NULL;
	}

	if (typeof jsValue === 'object') {
		const entries = Object.entries(jsValue);

		const result = new sass.types.Map(entries.length);
		for (const [ i, [ key, value ] ] of entries.entries()) {
			result.setKey(i, toSass(key));
			result.setValue(i, toSass(value));
		}

		return result;
	}

	// TODO?: Map

	throw new TypeError(`Could not convert an expected JS value \`${jsValue}\` to a SASS value.`);
};

const functions = {
	'ffi-require($module-path, $property-path: null)'(modulePath, propertyPath) {
		modulePath = toJS(modulePath);
		propertyPath = toJS(propertyPath);

		const dirname = this.options.file && path.dirname(this.options.file);
		const includePaths = Array.isArray(this.options.includePaths) ?
			this.options.includePaths :
			this.options.includePaths.split(':');

		const resolvedModulePath = require.resolve(modulePath, {
			paths: [ dirname ].concat(includePaths).filter(Boolean),
		});

		const module = require(resolvedModulePath);

		const value = propertyPath ? dotProp.get(module, propertyPath) : module;

		return toSass(value);
	},
};

const withSassFfiOptions = options => {
	options = options || {};
	return Object.assign({}, options, {
		functions: Object.assign({}, options.functions || {}, functions),
	});
};

module.exports = {
	withSassFfiOptions,
};
