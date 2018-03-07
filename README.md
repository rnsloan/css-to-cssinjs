# css-to-cssinjs

Converts a css string to a css-in-js format JavaScript object compatible with [https://github.com/Khan/aphrodite](https://github.com/Khan/aphrodite).

See a browser version here: [https://rnsloan.github.io/css-to-cssinjs/](https://rnsloan.github.io/css-to-cssinjs/)

## Usage

`npm install css-to-cssinjs`

```
import { convertCSS } from 'css-to-cssinjs';

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
{
  primary: { color: "red" },
  secondary: { width: "300px" },
  tertiary: { border: "1px solid red" }
}
```

### API

`convertCSS(cssInput[, options]) => cssInJs`

Arguments

1.  `cssInput` (`String`): a string of css
2.  `options` (`Object` [optional]):
    * `options.format` (`String` [optional]): the outputted format. Values `string` | `object` | `JSON`. Default to `String`.
    * `options.convertAnimations` (`Boolean` [optional]): parse keyframe animations. Default to `false`.

## Limitations

Is unable to generate the correct output for global pseudo selectors such as:

```
::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
}
```

By default does not parse animations as the output:

```
{
	"0%": {
		width: 200px;
	},
	"100%": {
		width: 800px;
	},
}
```

Will mean multiple animations with the same keyframes names will be merged. Can be changed via the `options` parameter.
