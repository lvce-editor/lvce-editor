import * as SafeTokenizeLine from '../SafeTokenizeLine/SafeTokenizeLine.js'
import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'

const getTokensViewportEmbedded = (lines, lineCache, linesWithEmbed) => {
  const tokenizersToLoad = []
  const embeddedResults = []
  let topContext = undefined
  for (const index of linesWithEmbed) {
    const result = lineCache[index + 1]
    const line = lines[index]
    if (result.embeddedLanguage) {
      const { embeddedLanguage, embeddedLanguageStart, embeddedLanguageEnd } = result
      const embeddedTokenizer = Tokenizer.getTokenizer(embeddedLanguage)
      if (embeddedLanguageStart !== line.length && embeddedTokenizer && embeddedTokenizer !== TokenizePlainText) {
        const isFull = embeddedLanguageStart === 0 && embeddedLanguageEnd === line.length
        const partialLine = line.slice(embeddedLanguageStart, embeddedLanguageEnd)
        const embedResult = SafeTokenizeLine.safeTokenizeLine(
          embeddedTokenizer.tokenizeLine,
          partialLine,
          topContext || embeddedTokenizer.initialLineState,
          embeddedTokenizer.hasArrayReturn
        )
        topContext = embedResult
        result.embeddedResultIndex = embeddedResults.length
        embeddedResults.push({
          result: embedResult,
          TokenMap: embeddedTokenizer.TokenMap,
          isFull,
        })
      } else {
        tokenizersToLoad.push(embeddedLanguage)
        embeddedResults.push({
          result: {},
          isFull: false,
          TokenMap: [],
        })
      }
    }
  }
  return {
    tokenizersToLoad,
    embeddedResults,
  }
}

// TODO only send changed lines to renderer process instead of all lines in viewport
export const getTokensViewport = (editor, startLineIndex, endLineIndex) => {
  const { invalidStartIndex, lineCache } = editor
  const { tokenizer, lines } = editor
  const { hasArrayReturn, tokenizeLine, initialLineState } = tokenizer
  const tokenizeStartIndex = invalidStartIndex
  const tokenizeEndIndex = invalidStartIndex < endLineIndex ? endLineIndex : tokenizeStartIndex
  const tokenizersToLoad = []
  const embeddedResults = []
  const linesWithEmbed = []
  for (let i = tokenizeStartIndex; i < tokenizeEndIndex; i++) {
    const lineState = i === 0 ? initialLineState : lineCache[i]
    const line = lines[i]
    const result = SafeTokenizeLine.safeTokenizeLine(tokenizeLine, line, lineState, hasArrayReturn)
    // TODO if lineCacheEnd matches the one before, skip tokenizing lines after
    lineCache[i + 1] = result
    if (result.embeddedLanguage) {
      result.embeddedResultIndex = linesWithEmbed.length
      linesWithEmbed.push(i)
    }
  }
  const visibleLines = lineCache.slice(startLineIndex + 1, endLineIndex + 1)
  if (linesWithEmbed.length > 0) {
    const { tokenizersToLoad, embeddedResults } = getTokensViewportEmbedded(lines, lineCache, linesWithEmbed)
    // TODO support lineCache with embedded content
    editor.invalidStartIndex = 0
    return {
      tokens: visibleLines,
      tokenizersToLoad,
      embeddedResults,
    }
  }
  editor.invalidStartIndex = Math.max(invalidStartIndex, tokenizeEndIndex)
  return {
    tokens: visibleLines,
    tokenizersToLoad,
    embeddedResults,
  }
}
