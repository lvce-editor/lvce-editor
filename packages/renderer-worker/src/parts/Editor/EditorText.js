import * as GetDecorationClassName from '../GetDecorationClassName/GetDecorationClassName.js'
import * as GetTokensViewport from '../GetTokensViewport/GetTokensViewport.js'
import * as NormalizeText from '../NormalizeText/NormalizeText.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'

// const getTokens = (editor) => {
//   const tokens = []
//   const lines = editor.lines
//   let lineState = editor.tokenizer.initialLineState
//   // TODO lineCache should probably only store endOfLineState
//   // because storing tokens could maybe result in high
//   // memory usage (e.g. 10000 lines * 10 tokens per line = 100 000 objects stored)
//   // on the other hand, scrolling should be really fast, and needlessly
//   // recomputing tokens would be a waste of cpu time and cause lots of garbage collection
//   const lineCache = editor.lineCache
//   // TODO only compute tokens in viewport
//   // console.log('minmax', editor.minLineY, editor.maxLineY)
//   // const cachedLineStates = Object.create(null)
//   // if(cachedLineStates[i])
//   const tokenizeLine = editor.tokenizer.tokenizeLine
//   for (let i = 0; i < lines.length; i++) {
//     if (lineCache[i]) {
//       // console.log('cached line')
//       tokens.push(lineCache[i].tokens)
//       continue
//     }
//     // TODO use TextDocument.getLine so that text document buffer implementation
//     // can be changed (e.g. vscode has piece tree, codemirror has something like chunked arrays / string[][])
//     const line = lines[i]
//     lineState = safeTokenizeLine(tokenizeLine, line, lineState)
//     const newTokens = lineState.tokens
//     lineCache[i] = lineState
//     tokens.push(newTokens)
//   }
//   return tokens
// }

// TODO vscode has an interesting approach for tokenizing:
// first, the viewport is tokenized from startLine to endLine
// the first iteration might not be accurate because for example
// there can be a open multiline comment at the start of the file
// which is not taken into account for this first tokenization
// but after some time (onIdle), the background tokenizer is invoked
// that gives accurate results (but can take much longer since it
// might need to parse from the start of the file)
//
// another approach would be to show plain text (non-highlighted)
// when scrolling fast and the tokenizer is too slow to parse from
// the start of the file
//
// the approach implemented below for tokenizing the viewport
// is just to parse from the start of the file if necessary
// that doesn't scale well for large files but it is simpler
// to implement for now

// TODO only send changed lines to renderer process instead of all lines in viewport

export const loadTokenizers = async (languageIds) => {
  for (const languageId of languageIds) {
    await Tokenizer.loadTokenizer(languageId)
  }
}

const invalidateLine = (editor, index) => {
  editor.validLines[index] = false
  if (index < editor.invalidStartIndex) {
    editor.invalidStartIndex = index
  }
}

const applyChangesToSyntaxHighlighting = (editor, changes) => {
  // TODO invalidate lines that are affected
}

// const getTokensIncremental = (editor, min, max) => {
//   const currentLength = editor.lineStateCache.length
//   const tokens = []
//   const lines = editor.lines
//   let lineState = editor.tokenizer.initialLineState
//   for (let i = currentLength; i < max; i++) {
//     const line = lines[i]
//     try {
//       lineState = editor.tokenizer.tokenizeLine(line, lineState)
//       if (!lineState || !lineState.tokens || !lineState.state) {
//         throw new Error('invalid tokenization result')
//       }
//     } catch (error) {
//       tokens.push([{ length: line.length, type: 0 }])
//       console.error(error)
//       // renderWithoutSyntaxHighlighting(state, firstRow, lastRow)
//       continue
//     }
//     const newTokens = lineState.tokens
//     tokens.push(newTokens)
//   }
//   return tokens
// }

// const getLineInfosIncremental = (editor, tokens, minLineY, maxLineY) => {
//   const result = []
//   const lines = editor.lines
//   const TokenMap = editor.tokenizer.TokenMap
//   for (let i = minLineY; i < maxLineY; i++) {
//     result.push(getLineInfo(lines[i], tokens[i], TokenMap))
//   }
//   return result
// }

const getLineInfoEmbeddedFull = (embeddedResults, tokenResults, line, normalize, tabSize) => {
  let start = 0
  let end = 0
  const lineInfo = []
  const embeddedResult = embeddedResults[tokenResults.embeddedResultIndex]
  const embeddedTokens = embeddedResult.result.tokens
  const embeddedTokenMap = embeddedResult.TokenMap
  for (let i = 0; i < embeddedTokens.length; i += 2) {
    const tokenType = embeddedTokens[i]
    const tokenLength = embeddedTokens[i + 1]
    let extraClassName = ''
    end += tokenLength
    const className = `Token ${extraClassName || embeddedTokenMap[tokenType] || 'Unknown'}`
    const text = line.slice(start, end)
    const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
    lineInfo.push(normalizedText, className)
    start = end
  }
  return lineInfo
}

const getLineInfoDefault = (line, tokenResults, embeddedResults, decorations, TokenMap, lineOffset, normalize, tabSize, width, deltaX) => {
  let start = 0
  let end = 0
  const lineInfo = []
  let decorationIndex = 0
  for (; decorationIndex < decorations.length; decorationIndex += 3) {
    const decorationOffset = decorations[decorationIndex]
    if (decorationOffset >= lineOffset) {
      break
    }
  }
  const tokens = tokenResults.tokens
  // TODO accurately measure char widths using offscreen canvas
  // and use fast measurements for monospace ascii text
  const charWidth = 10
  const minOffset = Math.ceil(deltaX / charWidth)
  const maxOffset = minOffset + Math.ceil(width / charWidth)
  let startIndex = 0

  for (let i = 0; i < tokens.length; i += 2) {
    const tokenLength = tokens[i + 1]
    end += tokenLength
    start = end
    if (start >= minOffset) {
      startIndex = i
      break
    }
  }

  for (let i = startIndex; i < tokens.length; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    const decorationOffset = decorations[decorationIndex]
    let extraClassName = ''
    if (decorationOffset !== undefined && decorationOffset - lineOffset === start) {
      const decorationLength = decorations[++decorationIndex]
      const decorationType = decorations[++decorationIndex]
      const decorationModifiers = decorations[++decorationIndex]
      // console.log('MATCHING DECORATION', {
      //   decorationIndex,
      //   decorationLength,
      //   decorationType,
      //   decorationModifiers,
      // })
      extraClassName = GetDecorationClassName.getDecorationClassName(decorationType)
    }

    end += tokenLength
    const text = line.slice(start, end)
    const className = `Token ${extraClassName || TokenMap[tokenType] || 'Unknown'}`
    const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
    lineInfo.push(normalizedText, className)
    start = end
    if (end >= maxOffset) {
      break
    }
  }
  return lineInfo
}

const getLineInfo = (line, tokenResults, embeddedResults, decorations, TokenMap, lineOffset, normalize, tabSize, width, deltaX) => {
  if (embeddedResults.length > 0 && tokenResults.embeddedResultIndex !== undefined) {
    const embeddedResult = embeddedResults[tokenResults.embeddedResultIndex]
    if (embeddedResult && embeddedResult.isFull) {
      return getLineInfoEmbeddedFull(embeddedResults, tokenResults, line, normalize, tabSize)
    }
  }
  return getLineInfoDefault(line, tokenResults, embeddedResults, decorations, TokenMap, lineOffset, normalize, tabSize, width, deltaX)
}

// TODO need lots of tests for this
const getLineInfosViewport = (editor, tokens, embeddedResults, minLineY, maxLineY, minLineOffset, width, deltaX) => {
  const result = []
  const { lines, tokenizer, decorations } = editor
  const { TokenMap } = tokenizer
  let offset = minLineOffset
  const tabSize = 2
  for (let i = minLineY; i < maxLineY; i++) {
    const line = lines[i]
    const normalize = NormalizeText.shouldNormalizeText(line)
    result.push(getLineInfo(line, tokens[i - minLineY], embeddedResults, decorations, TokenMap, offset, normalize, tabSize, width, deltaX))
    offset += line.length + 1
  }
  return result
}

export const getVisible = (editor) => {
  // console.log({ editor })
  // TODO should separate rendering from business logic somehow
  // currently hard to test because need to mock editor height, top, left,
  // invalidStartIndex, lineCache, etc. just for testing editorType
  // editor.invalidStartIndex = changes[0].start.rowIndex
  const { minLineY, numberOfVisibleLines, lines, width, deltaX } = editor
  const maxLineY = Math.min(minLineY + numberOfVisibleLines, lines.length)
  const { tokens, tokenizersToLoad, embeddedResults } = GetTokensViewport.getTokensViewport(editor, minLineY, maxLineY)
  const minLineOffset = TextDocument.offsetAt(editor, minLineY, 0)
  const textInfos = getLineInfosViewport(editor, tokens, embeddedResults, minLineY, maxLineY, minLineOffset, width, deltaX)
  if (tokenizersToLoad.length > 0) {
    loadTokenizers(tokenizersToLoad)
  }
  return textInfos
}
