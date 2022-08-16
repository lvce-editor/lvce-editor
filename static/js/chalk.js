import escapeStringRegexp from "./escape-string-regexp.js";
import ansiStyles from "./ansi-styles.js";
import require$$0 from "./supports-color.js";
function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function(path, base) {
      return commonjsRequire(path, base === void 0 || base === null ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}
function commonjsRequire() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
const TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;
const ESCAPES = new Map([
  ["n", "\n"],
  ["r", "\r"],
  ["t", "	"],
  ["b", "\b"],
  ["f", "\f"],
  ["v", "\v"],
  ["0", "\0"],
  ["\\", "\\"],
  ["e", ""],
  ["a", "\x07"]
]);
function unescape(c) {
  if (c[0] === "u" && c.length === 5 || c[0] === "x" && c.length === 3) {
    return String.fromCharCode(parseInt(c.slice(1), 16));
  }
  return ESCAPES.get(c) || c;
}
function parseArguments(name, args) {
  const results = [];
  const chunks = args.trim().split(/\s*,\s*/g);
  let matches;
  for (const chunk of chunks) {
    if (!isNaN(chunk)) {
      results.push(Number(chunk));
    } else if (matches = chunk.match(STRING_REGEX)) {
      results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, chr) => escape ? unescape(escape) : chr));
    } else {
      throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
    }
  }
  return results;
}
function parseStyle(style) {
  STYLE_REGEX.lastIndex = 0;
  const results = [];
  let matches;
  while ((matches = STYLE_REGEX.exec(style)) !== null) {
    const name = matches[1];
    if (matches[2]) {
      const args = parseArguments(name, matches[2]);
      results.push([name].concat(args));
    } else {
      results.push([name]);
    }
  }
  return results;
}
function buildStyle(chalk2, styles) {
  const enabled = {};
  for (const layer of styles) {
    for (const style of layer.styles) {
      enabled[style[0]] = layer.inverse ? null : style.slice(1);
    }
  }
  let current = chalk2;
  for (const styleName of Object.keys(enabled)) {
    if (Array.isArray(enabled[styleName])) {
      if (!(styleName in current)) {
        throw new Error(`Unknown Chalk style: ${styleName}`);
      }
      if (enabled[styleName].length > 0) {
        current = current[styleName].apply(current, enabled[styleName]);
      } else {
        current = current[styleName];
      }
    }
  }
  return current;
}
var templates = (chalk2, tmp) => {
  const styles = [];
  const chunks = [];
  let chunk = [];
  tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
    if (escapeChar) {
      chunk.push(unescape(escapeChar));
    } else if (style) {
      const str = chunk.join("");
      chunk = [];
      chunks.push(styles.length === 0 ? str : buildStyle(chalk2, styles)(str));
      styles.push({inverse, styles: parseStyle(style)});
    } else if (close) {
      if (styles.length === 0) {
        throw new Error("Found extraneous } in Chalk template literal");
      }
      chunks.push(buildStyle(chalk2, styles)(chunk.join("")));
      chunk = [];
      styles.pop();
    } else {
      chunk.push(chr);
    }
  });
  chunks.push(chunk.join(""));
  if (styles.length > 0) {
    const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
    throw new Error(errMsg);
  }
  return chunks.join("");
};
var chalk = createCommonjsModule(function(module) {
  const stdoutColor = require$$0.stdout;
  const levelMapping = ["ansi", "ansi", "ansi256", "ansi16m"];
  const skipModels = new Set(["gray"]);
  const styles = Object.create(null);
  function applyOptions(obj, options) {
    options = options || {};
    const scLevel = stdoutColor ? stdoutColor.level : 0;
    obj.level = options.level === void 0 ? scLevel : options.level;
    obj.enabled = "enabled" in options ? options.enabled : obj.level > 0;
  }
  function Chalk(options) {
    if (!this || !(this instanceof Chalk) || this.template) {
      const chalk2 = {};
      applyOptions(chalk2, options);
      chalk2.template = function() {
        const args = [].slice.call(arguments);
        return chalkTag.apply(null, [chalk2.template].concat(args));
      };
      Object.setPrototypeOf(chalk2, Chalk.prototype);
      Object.setPrototypeOf(chalk2.template, chalk2);
      chalk2.template.constructor = Chalk;
      return chalk2.template;
    }
    applyOptions(this, options);
  }
  for (const key of Object.keys(ansiStyles)) {
    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), "g");
    styles[key] = {
      get() {
        const codes = ansiStyles[key];
        return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
      }
    };
  }
  styles.visible = {
    get() {
      return build.call(this, this._styles || [], true, "visible");
    }
  };
  ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), "g");
  for (const model of Object.keys(ansiStyles.color.ansi)) {
    if (skipModels.has(model)) {
      continue;
    }
    styles[model] = {
      get() {
        const level = this.level;
        return function() {
          const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
          const codes = {
            open,
            close: ansiStyles.color.close,
            closeRe: ansiStyles.color.closeRe
          };
          return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
        };
      }
    };
  }
  ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), "g");
  for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
    if (skipModels.has(model)) {
      continue;
    }
    const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
    styles[bgModel] = {
      get() {
        const level = this.level;
        return function() {
          const open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments);
          const codes = {
            open,
            close: ansiStyles.bgColor.close,
            closeRe: ansiStyles.bgColor.closeRe
          };
          return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
        };
      }
    };
  }
  const proto = Object.defineProperties(() => {
  }, styles);
  function build(_styles, _empty, key) {
    const builder = function() {
      return applyStyle.apply(builder, arguments);
    };
    builder._styles = _styles;
    builder._empty = _empty;
    const self = this;
    Object.defineProperty(builder, "level", {
      enumerable: true,
      get() {
        return self.level;
      },
      set(level) {
        self.level = level;
      }
    });
    Object.defineProperty(builder, "enabled", {
      enumerable: true,
      get() {
        return self.enabled;
      },
      set(enabled) {
        self.enabled = enabled;
      }
    });
    builder.hasGrey = this.hasGrey || key === "gray" || key === "grey";
    builder.__proto__ = proto;
    return builder;
  }
  function applyStyle() {
    const args = arguments;
    const argsLen = args.length;
    let str = String(arguments[0]);
    if (argsLen === 0) {
      return "";
    }
    if (argsLen > 1) {
      for (let a = 1; a < argsLen; a++) {
        str += " " + args[a];
      }
    }
    if (!this.enabled || this.level <= 0 || !str) {
      return this._empty ? "" : str;
    }
    const originalDim = ansiStyles.dim.open;
    for (const code of this._styles.slice().reverse()) {
      str = code.open + str.replace(code.closeRe, code.open) + code.close;
      str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
    }
    ansiStyles.dim.open = originalDim;
    return str;
  }
  function chalkTag(chalk2, strings) {
    if (!Array.isArray(strings)) {
      return [].slice.call(arguments, 1).join(" ");
    }
    const args = [].slice.call(arguments, 2);
    const parts = [strings.raw[0]];
    for (let i = 1; i < strings.length; i++) {
      parts.push(String(args[i - 1]).replace(/[{}\\]/g, "\\$&"));
      parts.push(String(strings.raw[i]));
    }
    return templates(chalk2, parts.join(""));
  }
  Object.defineProperties(Chalk.prototype, styles);
  module.exports = Chalk();
  module.exports.supportsColor = stdoutColor;
  module.exports.default = module.exports;
});
export default chalk;
var supportsColor = chalk.supportsColor;
export {chalk as __moduleExports, supportsColor};
