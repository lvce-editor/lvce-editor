import * as EscapeHtml from '../EscapeHtml/EscapeHtml.js'
import * as SafeTokenizeLine from '../SafeTokenizeLine/SafeTokenizeLine.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
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

const getLineInfoHtml = (lineInfo) => {
  let html = '<div class="EditorRow">'
  for (let i = 0; i < lineInfo.length; i += 2) {
    const text = lineInfo[i]
    const className = lineInfo[i + 1]
    const escapedText = EscapeHtml.escapeHtml(text)
    html += `<span class="${className}">${escapedText}</span>`
  }
  html += '</div>'
  return html
}

const getLineInfosHtml = (lineInfos) => {
  const lineInfosHtml = lineInfos.map(getLineInfoHtml)
  return lineInfosHtml.join('')
}

const getLineInfos = (lines, tokenizer, languageId) => {
  const lineInfos = []
  const { tokenizeLine, initialLineState, hasArrayReturn, TokenMap } = tokenizer
  let currentLineState = initialLineState
  for (const line of lines) {
    const result = SafeTokenizeLine.safeTokenizeLine(languageId, tokenizeLine, line, currentLineState, hasArrayReturn)
    const { tokens } = result
    const lineInfo = getLineInfo(line, tokens, TokenMap)
    lineInfos.push(lineInfo)
    currentLineState = result
  }
  return lineInfos
}

export const tokenizeCodeBlock = (codeBlock, languageId) => {
  console.time('tokenize')
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const lines = SplitLines.splitLines(codeBlock)
  const lineInfos = getLineInfos(lines, tokenizer, languageId)
  const html = getLineInfosHtml(lineInfos)
  console.log({ lineInfos })
  console.timeEnd('tokenize')
  return html
}
