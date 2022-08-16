import _jsTokens from "./js-tokens.js";
import _helperValidatorIdentifier from "./babel-helper-validator-identifier.js";
import _chalk from "./chalk.js";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
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
var lib = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = highlight;
  exports.getChalk = getChalk2;
  exports.shouldHighlight = shouldHighlight2;
  const sometimesKeywords = new Set(["as", "async", "from", "get", "of", "set"]);
  function getDefs(chalk2) {
    return {
      keyword: chalk2.cyan,
      capitalized: chalk2.yellow,
      jsxIdentifier: chalk2.yellow,
      punctuator: chalk2.yellow,
      number: chalk2.magenta,
      string: chalk2.green,
      regex: chalk2.magenta,
      comment: chalk2.grey,
      invalid: chalk2.white.bgRed.bold
    };
  }
  const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
  const BRACKET = /^[()[\]{}]$/;
  let tokenize;
  {
    const JSX_TAG = /^[a-z][\w-]*$/i;
    const getTokenType = function(token, offset, text) {
      if (token.type === "name") {
        if ((0, _helperValidatorIdentifier.isKeyword)(token.value) || (0, _helperValidatorIdentifier.isStrictReservedWord)(token.value, true) || sometimesKeywords.has(token.value)) {
          return "keyword";
        }
        if (JSX_TAG.test(token.value) && (text[offset - 1] === "<" || text.slice(offset - 2, offset) == "</")) {
          return "jsxIdentifier";
        }
        if (token.value[0] !== token.value[0].toLowerCase()) {
          return "capitalized";
        }
      }
      if (token.type === "punctuator" && BRACKET.test(token.value)) {
        return "bracket";
      }
      if (token.type === "invalid" && (token.value === "@" || token.value === "#")) {
        return "punctuator";
      }
      return token.type;
    };
    tokenize = function* (text) {
      let match;
      while (match = _jsTokens.default.exec(text)) {
        const token = _jsTokens.matchToToken(match);
        yield {
          type: getTokenType(token, match.index, text),
          value: token.value
        };
      }
    };
  }
  function highlightTokens(defs, text) {
    let highlighted = "";
    for (const {
      type,
      value
    } of tokenize(text)) {
      const colorize = defs[type];
      if (colorize) {
        highlighted += value.split(NEWLINE).map((str) => colorize(str)).join("\n");
      } else {
        highlighted += value;
      }
    }
    return highlighted;
  }
  function shouldHighlight2(options) {
    return !!_chalk.supportsColor || options.forceColor;
  }
  function getChalk2(options) {
    return options.forceColor ? new _chalk.constructor({
      enabled: true,
      level: 1
    }) : _chalk;
  }
  function highlight(code, options = {}) {
    if (code !== "" && shouldHighlight2(options)) {
      const chalk2 = getChalk2(options);
      const defs = getDefs(chalk2);
      return highlightTokens(defs, code);
    } else {
      return code;
    }
  }
});
var __pika_web_default_export_for_treeshaking__ = /* @__PURE__ */ getDefaultExportFromCjs(lib);
export default __pika_web_default_export_for_treeshaking__;
var getChalk = lib.getChalk;
var shouldHighlight = lib.shouldHighlight;
export {lib as __moduleExports, getChalk, shouldHighlight};
