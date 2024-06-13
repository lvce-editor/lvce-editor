import * as NormalizeText from '../NormalizeText/NormalizeText.js'

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

const getStartDefaults = (tokens, minOffset) => {
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

// @ts-ignore
const getLineInfoEmbeddedFull = (embeddedResults, tokenResults, line, normalize, tabSize, width, deltaX, averageCharWidth, minOffset, maxOffset) => {
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

// @ts-ignore
const getOffsets = (deltaX, width, averageCharWidth) => {
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

const getDifference = (start, averageCharWidth, deltaX) => {
  const beforeWidth = start * averageCharWidth
  const difference = beforeWidth - deltaX
  return difference
}
