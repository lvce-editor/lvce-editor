import * as Tokenizer from '../Tokenizer/Tokenizer.ts'

export const loadTokenizers = async (languageIds: any) => {
  for (const languageId of languageIds) {
    // @ts-ignore
    await Tokenizer.loadTokenizer(languageId)
  }
}
