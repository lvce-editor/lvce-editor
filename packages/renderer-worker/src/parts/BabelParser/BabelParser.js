import * as LoadBabelParser from '../LoadBabelParser/LoadBabelParser.js'

export const parse = async (code, options) => {
  const BabelParse = await LoadBabelParser.loadBabelParser()
  return BabelParse.parse(code, options)
}
