import * as GetDecorationClassName from '../GetDecorationClassName/GetDecorationClassName.ts'
import * as GetTokensViewport from '../GetTokensViewport/GetTokensViewport.ts'
import * as LoadTokenizers from '../LoadTokenizers/LoadTokenizers.ts'
import * as NormalizeText from '../NormalizeText/NormalizeText.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'
// @ts-ignore

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

// @ts-ignore
const invalidateLine = (editor, index) => {
  editor.validLines[index] = false
  if (index < editor.invalidStartIndex) {
    editor.invalidStartIndex = index
  }
}

// @ts-ignore
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

const getStartDefaults = (tokens: any, minOffset: any) => {
  let start = 0
  let end = 0
  let startIndex = 0
  const tokensLength = tokens.length
  for (let i = 0; i < tokensLength; i += 2) {
    const tokenLength = tokens[i + 1]
    end += tokenLength
    start = end
    if (start >= minOffset) {
      start -= tokenLength
      end -= tokenLength
      startIndex = i
      break
    }
  }
  return {
    start,
    end,
    startIndex,
  }
}

const getLineInfoEmbeddedFull = (
  embeddedResults: any,
  tokenResults: any,
  line: any,
  normalize: any,
  tabSize: any,
  width: any,
  deltaX: any,
  averageCharWidth: any,
  minOffset: any,
  maxOffset: any,
) => {
  const lineInfo = []
  const embeddedResult = embeddedResults[tokenResults.embeddedResultIndex]
  const embeddedTokens = embeddedResult.result.tokens
  const embeddedTokenMap = embeddedResult.TokenMap
  const tokensLength = embeddedTokens.length
  let { startIndex, start, end } = getStartDefaults(embeddedTokens, minOffset)
  const difference = getDifference(start, averageCharWidth, deltaX)
  for (let i = startIndex; i < tokensLength; i += 2) {
    const tokenType = embeddedTokens[i]
    const tokenLength = embeddedTokens[i + 1]
    const extraClassName = ''
    end += tokenLength
    const className = `Token ${extraClassName || embeddedTokenMap[tokenType] || 'Unknown'}`
    const text = line.slice(start, end)
    const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
    lineInfo.push(normalizedText, className)
    start = end
    if (end >= maxOffset) {
      break
    }
  }
  return {
    lineInfo,
    difference,
  }
}

const getOffsets = (deltaX: any, width: any, averageCharWidth: any) => {
  // TODO accurately measure char widths using offscreen canvas
  // and use fast measurements for monospace ascii text
  if (deltaX === 0) {
    return {
      minOffset: 0,
      maxOffset: Math.ceil(width / averageCharWidth),
    }
  }
  const minOffset = Math.ceil(deltaX / averageCharWidth)
  const maxOffset = minOffset + Math.ceil(width / averageCharWidth)
  return {
    minOffset,
    maxOffset,
  }
}

const getDifference = (start: any, averageCharWidth: any, deltaX: any) => {
  const beforeWidth = start * averageCharWidth
  const difference = beforeWidth - deltaX
  return difference
}

const getLineInfoDefault = (
  line: any,
  tokenResults: any,
  embeddedResults: any,
  decorations: any,
  TokenMap: any,
  lineOffset: any,
  normalize: any,
  tabSize: any,
  width: any,
  deltaX: any,
  averageCharWidth: any,
  minOffset: any,
  maxOffset: any,
) => {
  const lineInfo = []
  let decorationIndex = 0
  for (; decorationIndex < decorations.length; decorationIndex += 3) {
    const decorationOffset = decorations[decorationIndex]
    if (decorationOffset >= lineOffset) {
      break
    }
  }
  const tokens = tokenResults.tokens
  let { startIndex, start, end } = getStartDefaults(tokens, minOffset)
  const difference = getDifference(start, averageCharWidth, deltaX)
  const tokensLength = tokens.length
  for (let i = startIndex; i < tokensLength; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    const decorationOffset = decorations[decorationIndex]
    let extraClassName = ''
    if (decorationOffset !== undefined && decorationOffset - lineOffset === start) {
      // @ts-ignore
      const decorationLength = decorations[++decorationIndex]
      const decorationType = decorations[++decorationIndex]
      // @ts-ignore
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
  return {
    lineInfo,
    difference,
  }
}

const getLineInfo = (
  line: any,
  tokenResults: any,
  embeddedResults: any,
  decorations: any,
  TokenMap: any,
  lineOffset: any,
  normalize: any,
  tabSize: any,
  width: any,
  deltaX: any,
  averageCharWidth: any,
) => {
  const { minOffset, maxOffset } = getOffsets(deltaX, width, averageCharWidth)
  if (embeddedResults.length > 0 && tokenResults.embeddedResultIndex !== undefined) {
    const embeddedResult = embeddedResults[tokenResults.embeddedResultIndex]
    if (embeddedResult && embeddedResult.isFull) {
      return getLineInfoEmbeddedFull(embeddedResults, tokenResults, line, normalize, tabSize, width, deltaX, averageCharWidth, minOffset, maxOffset)
    }
  }
  return getLineInfoDefault(
    line,
    tokenResults,
    embeddedResults,
    decorations,
    TokenMap,
    lineOffset,
    normalize,
    tabSize,
    width,
    deltaX,
    averageCharWidth,
    minOffset,
    maxOffset,
  )
}

// TODO need lots of tests for this
const getLineInfosViewport = (
  editor: any,
  tokens: any,
  embeddedResults: any,
  minLineY: any,
  maxLineY: any,
  minLineOffset: any,
  width: any,
  deltaX: any,
  averageCharWidth: any,
) => {
  const result = []
  const differences = []
  const { lines, tokenizerId, decorations } = editor
  const tokenizer = TokenizerMap.get(tokenizerId)
  const { TokenMap } = tokenizer
  let offset = minLineOffset
  const tabSize = 2
  for (let i = minLineY; i < maxLineY; i++) {
    const line = lines[i]
    const normalize = NormalizeText.shouldNormalizeText(line)
    const { lineInfo, difference } = getLineInfo(
      line,
      tokens[i - minLineY],
      embeddedResults,
      decorations,
      TokenMap,
      offset,
      normalize,
      tabSize,
      width,
      deltaX,
      averageCharWidth,
    )
    result.push(lineInfo)
    differences.push(difference)
    offset += line.length + 1
  }
  return {
    result,
    differences,
  }
}

export const getVisible = (editor: any) => {
  // console.log({ editor })
  // TODO should separate rendering from business logic somehow
  // currently hard to test because need to mock editor height, top, left,
  // invalidStartIndex, lineCache, etc. just for testing editorType
  // editor.invalidStartIndex = changes[0].start.rowIndex
  // @ts-ignore
  const { minLineY, numberOfVisibleLines, lines, width, deltaX, fontWeight, fontSize, fontFamily, letterSpacing, charWidth } = editor
  const maxLineY = Math.min(minLineY + numberOfVisibleLines, lines.length)
  const { tokens, tokenizersToLoad, embeddedResults } = GetTokensViewport.getTokensViewport(editor, minLineY, maxLineY)
  const minLineOffset = TextDocument.offsetAtSync(editor, minLineY, 0)
  const averageCharWidth = charWidth
  const { result, differences } = getLineInfosViewport(
    editor,
    tokens,
    embeddedResults,
    minLineY,
    maxLineY,
    minLineOffset,
    width,
    deltaX,
    averageCharWidth,
  )
  if (tokenizersToLoad.length > 0) {
    LoadTokenizers.loadTokenizers(tokenizersToLoad)
  }
  return {
    textInfos: result,
    differences,
  }
}
