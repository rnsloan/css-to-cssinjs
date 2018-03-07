import * as css from "css";
import * as fs from "fs";
import * as stringifyObject from "stringify-object";

/*
// used for debugging
function writeToFile(input: object): void {
  fs.writeFile(
    `${__dirname}/temp.js`,
    stringifyObject(input, {
      indent: "  ",
      singleQuotes: false
    }),
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    }
  );
}
*/

function formatSelectorName(selector: string): string {
  return selector.replace(/#|\./g, "");
}

function formatProperty(dec: string): string {
  return dec.replace(/-(\w)/g, (a, b) => {
    return b.toUpperCase();
  });
}

function buildDeclarations(declarations: { type; property; value }[]) {
  const formattedDeclarations = {};
  declarations.forEach(dec => {
    if (dec.type !== "declaration") return;
    const property = formatProperty(dec.property);
    return (formattedDeclarations[property] = dec.value.replace(/"|'/g, ""));
  });
  return formattedDeclarations;
}

export interface Options {
  format?: "string" | "object" | "json";
  convertAnimations?: boolean;
}

export function convertCSS(
  cssInput: string,
  options: Options = {}
): object | string {
  const ast = css.parse(cssInput);
  const cssInJs = {};
  const pseudoSelectors = {};

  ast.stylesheet.rules.forEach(rule => {
    if (rule.type === "media") {
      const mediaQuery = `@media ${rule.media}`;
      rule.rules.forEach(innerRule => {
        const selectors = innerRule.selectors;
        const declarations = buildDeclarations(innerRule.declarations);
        selectors.forEach(selector => {
          cssInJs[formatSelectorName(selector)] = Object.assign(
            cssInJs[selector] || {},
            {
              [mediaQuery]: declarations
            }
          );
        });
      });
    }

    if (rule.type === "keyframes" && options.convertAnimations) {
      rule.keyframes.forEach(keyframe => {
        const declarations = buildDeclarations(keyframe.declarations);
        keyframe.values.forEach(value => {
          cssInJs[value] = Object.assign(cssInJs[value] || {}, declarations);
        });
      });
    }

    if (rule.type !== "rule") return;

    const declarations = buildDeclarations(rule.declarations);
    rule.selectors.forEach(selector => {
      if (selector.indexOf(":") !== -1) {
        return (pseudoSelectors[formatSelectorName(selector)] = declarations);
      }
      return (cssInJs[formatSelectorName(selector)] = declarations);
    });
  });

  Object.keys(pseudoSelectors).forEach(key => {
    /*
    * toggle:hover
    * = ['toggle', ':', 'hover]
    */
    const split = key.split(/(:+)/);

    cssInJs[split[0]] = Object.assign(cssInJs[split[0]] || {}, {
      [`${split[1]}${split[2]}`]: pseudoSelectors[key]
    });
  });

  if (options.format) {
    if (options.format.toLowerCase() === "json") {
      return JSON.stringify(cssInJs);
    }

    if (options.format.toLowerCase() === "object") {
      return cssInJs;
    }
  }

  return stringifyObject(cssInJs, {
    indent: "  ",
    singleQuotes: false
  });
}
