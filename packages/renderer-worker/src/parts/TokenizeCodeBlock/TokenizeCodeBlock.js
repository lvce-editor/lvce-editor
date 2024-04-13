import * as GetInitialLineState from '../GetInitialLineState/GetInitialLineState.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SafeTokenizeLine from '../SafeTokenizeLine/SafeTokenizeLine.js'
import * as GetTokenizePath from '../GetTokenizePath/GetTokenizePath.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'

const getLineInfo = (line, tokens, TokenMap) => {
  const tokensLength = tokens.length
  let end = 0
  let start = 0
  const lineInfo = []
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
  const lineInfos = []
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

const tokenizeCodeBlockWorker = async (codeBlock, languageId, tokenizePath) => {
  await SyntaxHighlightingWorker.getOrCreate()
  return SyntaxHighlightingWorker.invoke('Tokenizer.tokenizeCodeBlock', codeBlock, languageId, tokenizePath)
}

export const tokenizeCodeBlock = async (codeBlock, languageId) => {
  const useSyntaxHighlightingWorker = Preferences.get('editor.useSyntaxHighlightingWorker')
  if (useSyntaxHighlightingWorker) {
    const tokenizePath = GetTokenizePath.getTokenizePath(languageId)
    return tokenizeCodeBlockWorker(codeBlock, languageId, tokenizePath)
  }
  await Tokenizer.loadTokenizer(languageId)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const lines = SplitLines.splitLines(codeBlock)
  const lineInfos = getLineInfos(lines, tokenizer, languageId)
  return lineInfos
}
