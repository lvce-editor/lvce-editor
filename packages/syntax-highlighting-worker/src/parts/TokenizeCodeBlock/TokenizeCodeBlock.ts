import * as GetInitialLineState from '../GetInitialLineState/GetInitialLineState.ts'
import * as SafeTokenizeLine from '../SafeTokenizeLine/SafeTokenizeLine.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'

const getLineInfo = (line, tokens, TokenMap) => {
  const tokensLength = tokens.length
  let end = 0
  let start = 0
  const lineInfo: any[] = []
  for (let i = 0; i < tokensLength; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    end += tokenLength
    const text = line.slice(start, end)
    const className = `Token ${TokenMap[tokenType] || 'Unknown'}`
    const normalizedText = text
    lineInfo.push(normalizedText, className)
    start = end
  }
  return lineInfo
}

const getLineInfos = (lines, tokenizer, languageId) => {
  const lineInfos: any[] = []
  const { tokenizeLine, initialLineState, hasArrayReturn, TokenMap } = tokenizer
  let currentLineState = GetInitialLineState.getInitialLineState(initialLineState)
  for (const line of lines) {
    const result = SafeTokenizeLine.safeTokenizeLine(languageId, tokenizeLine, line, currentLineState, hasArrayReturn)
    const { tokens } = result
    const lineInfo = getLineInfo(line, tokens, TokenMap)
    lineInfos.push(lineInfo)
    currentLineState = result
  }
  return lineInfos
}

export const tokenizeCodeBlock = async (codeBlock: string, languageId: string, tokenizerPath: string) => {
  await Tokenizer.loadTokenizer(languageId, tokenizerPath)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const lines = SplitLines.splitLines(codeBlock)
  const lineInfos = getLineInfos(lines, tokenizer, languageId)
  return lineInfos
}
