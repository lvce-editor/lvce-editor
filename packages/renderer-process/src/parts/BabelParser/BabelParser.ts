import * as LoadBabelParser from '../LoadBabelParser/LoadBabelParser.ts'

export const parse = async (code, options) => {
  const BabelParse = await LoadBabelParser.loadBabelParser()
  return BabelParse.parse(code, options)
}
