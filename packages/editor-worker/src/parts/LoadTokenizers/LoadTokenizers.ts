import * as Tokenizer from '../Tokenizer/Tokenizer.ts'

export const loadTokenizers = async (languageIds: any) => {
  for (const languageId of languageIds) {
    await Tokenizer.loadTokenizer(languageId)
  }
}
