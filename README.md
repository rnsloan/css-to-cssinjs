# css-to-cssinjs

Converts a css string to a css-in-js format JavaScript object compatible with [https://github.com/Khan/aphrodite](https://github.com/Khan/aphrodite).

See a browser version here: [https://rnsloan.github.io/css-to-cssinjs/](https://rnsloan.github.io/css-to-cssinjs/)

## Usage

`npm install css-to-cssinjs`

```
import { convertCSS } from 'css-to-cssinjs';
// const convertCSS = require('css-to-cssinjs').convertCSS;

convertCSS(`
    #primary {
        color: red
    }
    #secondary {
        width: 300px
    }
    .tertiary {
        border: 1px solid red
    }
`)
```

Returns:

```
'{
  primary: { color: "red" },
  secondary: { width: "300px" },
  tertiary: { border: "1px solid red" }
}'
```

### API

`convertCSS(cssInput[, options]) => cssInJs`

Arguments

1.  `cssInput` (`String`): a string of css
2.  `options` (`Object` [optional]):
    * `options.format` (`String` [optional]): the outputted format. Values `string` | `object` | `JSON`. Default to `string`.
    * `options.convertAnimations` (`Boolean` [optional]): parse keyframe animations. Default to `false`.

## Limitations

Is unable to generate the correct output for global pseudo selectors such as:

```
::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
}
```

By default does not parse animations. Looking at the output from a single CSS animation with two keyframes:

```
{
	"0%": {
		width: 200px;
	},
	"100%": {
		width: 800px;
	}
}
```

If any other animation uses the same keyframe values they will be merged together:


```
{
	"0%": {
		width: 200px;
		color: red;
	},
	"50%": {	
		color: orange;
	},
	"100%": {
		width: 800px;
		color: green;
	}
}
```

Animation conversion can be enabled via the `options` parameter.
