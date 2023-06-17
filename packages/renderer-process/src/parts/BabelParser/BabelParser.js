export const parse = async (code, options) => {
  const BabelParse = await import('../../../../../static/js/babel-parser.js')
  return BabelParse.parse(code, options)
}
