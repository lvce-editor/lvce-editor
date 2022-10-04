import * as TextDocument from '../TextDocument/TextDocument.js'
import * as SafeTokenizeLine from '../SafeTokenizeLine/SafeTokenizeLine.js'

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

const getTokensFromCache = (result) => {
  return result.tokens
}

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
const getTokensViewport = (editor, startLineIndex, endLineIndex) => {
  const invalidStartIndex = editor.invalidStartIndex
  const lineCache = editor.lineCache
  if (endLineIndex <= invalidStartIndex) {
    return lineCache
      .slice(startLineIndex + 1, endLineIndex + 1)
      .map(getTokensFromCache)
  }
  const hasArrayReturn = editor.tokenizer.hasArrayReturn

  const tokenizeLine = editor.tokenizer.tokenizeLine
  if (startLineIndex <= invalidStartIndex) {
    for (let i = invalidStartIndex; i < endLineIndex; i++) {
      const lineState =
        i === 0 ? editor.tokenizer.initialLineState : editor.lineCache[i]
      const line = editor.lines[i]
      const result = SafeTokenizeLine.safeTokenizeLine(
        tokenizeLine,
        line,
        lineState,
        hasArrayReturn
      )
      // TODO if lineCacheEnd matches the one before, skip tokenizing lines after
      lineCache[i + 1] = result
    }
    editor.invalidStartIndex = endLineIndex
    return lineCache
      .slice(startLineIndex + 1, endLineIndex + 1)
      .map(getTokensFromCache)
  }
  // TODO combine for loops
  for (let i = invalidStartIndex; i < startLineIndex; i++) {
    const lineState = editor.lineCache[i]
    const line = editor.lines[i]
    const result = SafeTokenizeLine.safeTokenizeLine(
      tokenizeLine,
      line,
      lineState,
      hasArrayReturn
    )
    lineCache[i + 1] = result
  }
  for (let i = startLineIndex; i < endLineIndex; i++) {
    const lineState = editor.lineCache[i]
    const line = editor.lines[i]
    const result = SafeTokenizeLine.safeTokenizeLine(
      tokenizeLine,
      line,
      lineState,
      hasArrayReturn
    )
    lineCache[i + 1] = result
    editor.invalidStartIndex = endLineIndex
  }
  return lineCache
    .slice(startLineIndex + 1, endLineIndex + 1)
    .map(getTokensFromCache)
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

const getDecorationClassName = (type) => {
  switch (type) {
    case 2816:
    case 2817:
    case 2824:
    case 2825:
    case 2856:
    case 2857:
    case 3072:
    case 3073:
    case 3077:
    case 3088:
      return 'Function'
    case 1792:
    case 1793:
      return 'Parameter'
    case 512:
    case 513:
    case 769:
    case 1024:
    case 1536:
    case 1537:
    case 1544:
    case 1545:
      return 'Type'
    case 2048:
    case 2049:
    case 2056:
    case 2057:
    case 2064:
    case 2080:
    case 2081:
    case 2088:
    case 2089:
    case 2313:
    case 2560:
    case 2561:
    case 2569:
    case 2584:
      return 'VariableName'
    case 256:
    case 257:
    case 272:
      return 'Class'
    default:
      return `Unknown-${type}`
  }
}

const getLineInfo = (line, tokens, decorations, TokenMap, lineOffset) => {
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

  // console.log({ tokens, decorations })
  for (let i = 0; i < tokens.length; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    const decorationOffset = decorations[decorationIndex]
    let extraClassName = ''
    if (
      decorationOffset !== undefined &&
      decorationOffset - lineOffset === start
    ) {
      const decorationLength = decorations[++decorationIndex]
      const decorationType = decorations[++decorationIndex]
      const decorationModifiers = decorations[++decorationIndex]
      // console.log('MATCHING DECORATION', {
      //   decorationIndex,
      //   decorationLength,
      //   decorationType,
      //   decorationModifiers,
      // })
      extraClassName = getDecorationClassName(decorationType)
    }

    end += tokenLength
    const text = line.slice(start, end)
    const className = `Token ${
      extraClassName || TokenMap[tokenType] || 'Unknown'
    }`
    lineInfo.push(text, className)
    start = end
  }
  return lineInfo
}

// TODO need lots of tests for this
const getLineInfosViewport = (
  editor,
  tokens,
  minLineY,
  maxLineY,
  minLineOffset
) => {
  const result = []
  const { lines, tokenizer, decorations } = editor
  const { TokenMap } = tokenizer
  let offset = minLineOffset
  for (let i = minLineY; i < maxLineY; i++) {
    const line = lines[i]
    result.push(
      getLineInfo(line, tokens[i - minLineY], decorations, TokenMap, offset)
    )
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
  const { minLineY, numberOfVisibleLines, lines } = editor
  const maxLineY = Math.min(minLineY + numberOfVisibleLines, lines.length)
  const tokens = getTokensViewport(editor, minLineY, maxLineY)
  const minLineOffset = TextDocument.offsetAt(editor, minLineY, 0)
  const textInfos = getLineInfosViewport(
    editor,
    tokens,
    minLineY,
    maxLineY,
    minLineOffset
  )
  return textInfos
}
