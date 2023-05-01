import * as BabelParse from '../../../../../static/js/babel-parser.js'

export const parse = (code, options) => {
  return BabelParse.parse(code, options)
}
