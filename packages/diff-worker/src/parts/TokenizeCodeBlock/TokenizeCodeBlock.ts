import * as GetLineInfos from '../GetLineInfos/GetLineInfos.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'

export const tokenizeCodeBlock = async (codeBlock: string, languageId: string, tokenizerPath: string) => {
  await Tokenizer.loadTokenizer(languageId, tokenizerPath)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const lines = SplitLines.splitLines(codeBlock)
  const lineInfos = GetLineInfos.getLineInfos(lines, tokenizer, languageId)
  return lineInfos
}
