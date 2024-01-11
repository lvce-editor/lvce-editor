import * as Tokenizer from '../Tokenizer/Tokenizer.js'

export const loadTokenizers = async (languageIds) => {
  for (const languageId of languageIds) {
    await Tokenizer.loadTokenizer(languageId)
  }
}
