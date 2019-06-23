# SASS/SCSS Foreign function interface
[![Build Status](https://travis-ci.org/futpib/sass-ffi.svg?branch=master)](https://travis-ci.org/futpib/sass-ffi) [![Coverage Status](https://coveralls.io/repos/github/futpib/sass-ffi/badge.svg?branch=master)](https://coveralls.io/github/futpib/sass-ffi?branch=master)

Require JS values from SASS/SCSS

## Features

### `ffi-require($module-path, $property-path: null)`

#### Import all values from a `.js` file

```js
// themes.js

module.exports = {
	light: {
		color: 'white',
		background: 'black',
	},
	dark: {
		color: 'black',
		background: 'white',
	},
};
```

```scss
// themes.scss

$themes: ffi-require('./themes');

$theme-light: map-get($themes, 'light');
$theme-dark: map-get($themes, 'dark');

body.theme-light {
	color: map-get($theme-light, 'color');
	background: map-get($theme-light, 'background');
}

body.theme-dark {
	color: map-get($theme-dark, 'color');
	background: map-get($theme-dark, 'background');
}
```

#### Import a single property from a `.js` file

```js
// config.js

module.exports = {
	env: process.env,
};

```

```scss
// hack.scss

$node-env: ffi-require('./config, 'env.NODE_ENV');

body:after {
	content: $node-env;
};
```

## Install

```
yarn add sass-ffi
```

## Usage with Webpack

Simply replace `sass-loader` with `sass-ffi/webpack-loader`.

## Usage with `node-sass`

```js
const sass = require('node-sass');
const { withSassFfiOptions } = require('sass-ffi');

sass.render(withSassFfiOptions({
	/* your options here */
}), (err, result) => {
	console.log({ err, result });
});
```
